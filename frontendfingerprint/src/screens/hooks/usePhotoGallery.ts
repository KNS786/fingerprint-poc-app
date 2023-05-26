import {useState, useEffect} from "react"
import {isPlatform} from "@ionic/react"

import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera"
import {Filesystem, Directory, FilesystemDirectory} from "@capacitor/filesystem"
import {Preferences} from "@capacitor/preferences"
import {Capacitor} from "@capacitor/core"
import axios from "axios"
import {BASE_URL, API_KEY} from "../azure-config"

// import {uploadFile} from "../utils/uploadFile"

async function base64FromPath(path: string): Promise<string> {
	const response = await fetch(path)
	const blob = await response.blob()
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onerror = reject
		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result)
			} else {
				reject("method did not return a string")
			}
		}
		reader.readAsDataURL(blob)
	})
}

const savePicture = async (photo: Photo, fileName: string): Promise<any> => {
	const base64Data = await base64FromPath(photo.webPath!)
	const savedFile = await Filesystem.writeFile({
		path: fileName,
		data: base64Data,
		directory: Directory.Data,
	})

	// Use webPath to display the new image instead of base64 since it's
	// already loaded into memory
	return {
		filepath: fileName,
		webviewPath: photo.webPath,
		savedFile,
		base64Data,
	}
}

const uploadPhoto = async ({base64Data}: any, route: string) => {
	const response = await axios
		.post(
			`http://127.0.0.1:5000/${route}`,
			{
				image_data: base64Data,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		.then((resp: any) => resp.data)
	console.log("response :::", response)
}

const verifyPicture = async () => {
	const response = await axios
		.get("http://127.0.0.1:5000/verify")
		.then((resp: any) => resp.data)
	return {faceMatched: response.faceMatched === "True"}
}

export function usePhotoGallery(screen) {
	const [photos, setPhotos] = useState<any>([])
	const [isFaceMatched, setFaceMatched] = useState<boolean>(false)

	const takePhoto = async () => {
		try {
			const photo = await Camera.getPhoto({
				resultType: CameraResultType.Uri,
				source: CameraSource.Camera,
				quality: 100,
			})
			console.log("photo :::", photo)
			const fileName = new Date().getTime() + ".jpeg"
			const newPhotos = [
				{
					filepath: fileName,
					webviewPath: photo.webPath,
				},
				...photos,
			]
			setPhotos(newPhotos)
			// uploadFile(photo.webPath)

			const savePic = await savePicture(photo, fileName)
			console.log("savePic :::", savePic)
			await uploadPhoto(savePic, screen)
			if (screen === "login") {
				const verifyPicture = await verifyPicture()
				setFaceMatched(verifyPicture.faceMatched)
			}

			// const fileContent = await Filesystem.readFile({
			// 	path: savePic.uri,
			// 	directory: FilesystemDirectory.Data,
			// })

			// console.log("fileContent ::", fileContent)

			// const formData = new FormData()
			// formData.append("blob", savePic.base64Data)
			// let data = JSON.stringify({
			// 	url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTl25JcRqr0up0biB1eQWTfdZP3mhHwa9ZZQ&usqp=CAU",
			// })

			// const azureResponse = await axios.post(
			// 	`${BASE_URL}/face/v1.0/detect?returnFaceId=true`,
			// 	data,
			// 	{
			// 		headers: {
			// 			"Content-type": "application/json",
			// 			"Ocp-Apim-Subscription-Key": API_KEY,
			// 		},
			// 	}
			// )
			// console.log("azureResponse :::", azureResponse)

			// return azureResponse.data.imageUrl
			return photos
		} catch (error) {
			console.error("Error taking photo", error)
		}
	}

	return {
		takePhoto,
		photos,
	}
}
