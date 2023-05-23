import {useState, useEffect} from "react"
import {isPlatform} from "@ionic/react"

import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera"
import {Filesystem, Directory} from "@capacitor/filesystem"
import {Preferences} from "@capacitor/preferences"
import {Capacitor} from "@capacitor/core"

export function usePhotoGallery() {
	const [photos, setPhotos] = useState<UserPhoto[]>([])

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
		} catch (error) {
			console.error("Error taking photo", error)
		}
	}

	return {
		takePhoto,
		photos,
	}
}
