import React, {useState, useEffect} from "react"
import {IonContent, IonGrid, IonRow, IonCol, IonImg} from "@ionic/react"
import {usePhotoGallery} from "./hooks/usePhotoGallery"

import {isPlatform} from "@ionic/react"

import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera"
import {Filesystem, Directory} from "@capacitor/filesystem"
import {Preferences} from "@capacitor/preferences"
import {Capacitor} from "@capacitor/core"

const LoginFaceId: React.FC<any> = () => {
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

	const {photos, takePhoto, isFaceMatched} = usePhotoGallery("login")

	return (
		<IonContent>
			<div>
				<button onClick={takePhoto}>Login</button>
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
				<div className="flex flex-col">
					{isFaceMatched?.msg && <p>{isFaceMatched?.msg}</p>}

					{isFaceMatched?.accuracy && (
						<p>accuracy : {isFaceMatched.accuracy}</p>
					)}
				</div>
			</div>
		</IonContent>
	)
}

export default LoginFaceId
