import React, {useState, useEffect} from "react"
import {IonContent, IonGrid, IonRow, IonCol, IonImg} from "@ionic/react"
import {usePhotoGallery} from "./hooks/usePhotoGallery"

import {isPlatform} from "@ionic/react"

import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera"
import {Filesystem, Directory} from "@capacitor/filesystem"
import {Preferences} from "@capacitor/preferences"
import {Capacitor} from "@capacitor/core"
import {useHistory} from "react-router-dom"

const RegisterFaceId: React.FC<any> = () => {
	const [imageUrl, setImageUrl] = useState("")
	const history = useHistory()

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

	const {photos, takePhoto, register} = usePhotoGallery("register")
	console.log("register ::", register)

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
						{photos.map((photo: any, index: number) => (
							<IonCol
								size="6"
								key={photo.filepath}>
								<IonImg src={photo.webviewPath} />
							</IonCol>
						))}
					</IonRow>
				</IonGrid>
				{register && (
					<>
						<p>{register}</p>
						<button
							onClick={(e: any) => {
								history.push("/login")
							}}>
							{" "}
							Go To Login
						</button>
					</>
				)}
			</div>
		</IonContent>
	)
}

export default RegisterFaceId
