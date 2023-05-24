import React, {useState, useEffect} from "react"
import {IonContent, IonGrid, IonRow, IonCol, IonImg} from "@ionic/react"
import {usePhotoGallery} from "./hooks/usePhotoGallery"

import {isPlatform} from "@ionic/react"

import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera"
import {Filesystem, Directory} from "@capacitor/filesystem"
import {Preferences} from "@capacitor/preferences"
import {Capacitor} from "@capacitor/core"

const RegisterFaceId: React.FC<any> = () => {
	const [imageUrl, setImageUrl] = useState("")

	// const takePhoto = async () => {
	// 	try {
	// 		const image = await Camera.getPhoto({
	// 			resultType: CameraResultType.Uri,
	// 			source: CameraSource.Camera,
	// 			quality: 100,
	// 		})

	// 		// setImageUrl(image.webPath)
	// 	} catch (error) {
	// 		console.error("Error taking photo", error)
	// 	}
	// }

	const {photos, takePhoto} = usePhotoGallery()

	return (
		<IonContent>
			<div>
				<button onClick={takePhoto}>Register</button>
				{/* {imageUrl && (
					<img
						src={imageUrl}
						alt="Captured"
						style={{maxWidth: "300px"}}
					/>
				)} */}
				<IonGrid>
					<IonRow>
						{photos.map((photo, index) => (
							<IonCol
								size="6"
								key={photo.filepath}>
								<IonImg src={photo.webviewPath} />
							</IonCol>
						))}
					</IonRow>
				</IonGrid>
			</div>
		</IonContent>
	)
}

export default RegisterFaceId
