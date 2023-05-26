import * as faceapi from "face-api.js"
import * as fs from "fs"
import * as path from "path"

async function loadModels() {
	const modelPath = path.resolve(__dirname, "models")
	console.log("modalPath ::", modelPath)
	await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
	await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath)
	await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath)
}

async function compareFaces() {
	await loadModels()

	const image1: any = await faceapi.bufferToImage(
		Buffer.from(fs.readFileSync("../../../images/register.jpg"))
	)
	const image2: any = await faceapi.bufferToImage(
		Buffer.from(fs.readFileSync("../../../images/login.jpg"))
	)

	// const image1 = await faceapi.bufferToImage(
	// 	fs.readFileSync("/home/navani/Desktop/images/register.jpg")
	// )
	// const image2 = await faceapi.bufferToImage(
	// 	fs.readFileSync("/home/navani/Desktop/images/login.jpg")
	// )

	const face1 = await faceapi
		.detectSingleFace(image1)
		.withFaceLandmarks()
		.withFaceDescriptor()
	console.log("face1 :::", face1)
	const face2 = await faceapi
		.detectSingleFace(image2)
		.withFaceLandmarks()
		.withFaceDescriptor()
	console.log("face2 ::", face2)

	if (face1 && face2) {
		const distance = faceapi.euclideanDistance(
			face1.descriptor,
			face2.descriptor
		)
		console.log("Face distance:", distance)
	} else {
		console.log("No faces detected in one or both images.")
	}
}

module.exports = compareFaces
