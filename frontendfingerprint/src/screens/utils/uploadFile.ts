import axios from "axios"
import {BASE_URL, API_KEY} from "../azure-config"
import {Filesystem, Directory} from "@capacitor/core"

async function saveImageFile(image) {}

const convertBlobToBase64 = (blob: Blob) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onerror = reject
		reader.onload = () => {
			resolve(reader.result)
		}
		reader.readAsDataURL(blob)
	})

export async function uploadFile(image: any) {
	console.log("BASE_URL", BASE_URL)
	console.log("API_KEY ", API_KEY)

	// saveImageFile(image)
	try {
		const response = await fetch(image.webPath)
		const blob = await response.blob()

		const results = (await this.convertBlobToBase64(blob)) as string

		// Write the file to the data directory
		const fileName = new Date().getTime() + ".jpeg"
		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: base64Data,
			directory: Directory.Data,
		})

		console.log("saved file :::", savedFile)

		// Use the File API to create a new file from the blob
		const file = new File([blob], "image.png", {type: "image/png"})

		// Save the file or perform any additional processing
		console.log("Image file:", file)

		const formData = new FormData()
		formData.append("file", file)

		console.log("formData :::", formData)

		const azureResponse = await axios.post(`${BASE_URL}/upload`, formData, {
			headers: {
				"Content-type": "multipart/form-data",
				"Ocp-Apim-Subscription-Key": API_KEY,
			},
		})
		console.log("azureResponse :::", azureResponse)

		return azureResponse.data.imageUrl
	} catch (error) {
		console.log("Error saving image file:", error)
	}
}
