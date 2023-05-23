import React from "react"
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
} from "@ionic/react"

import fingerPrintIconSvg from "../assets/finger-print-icon.svg"

const RegisterFingerPrint: React.FC<any> = () => {
	const queryParams = new URLSearchParams(window.location.search)
	const empName = queryParams.get("name")

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Login Finger Print</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<div className="flex flex-col items-center">
					<div className="flex">
						<h1>Hello,{empName}</h1>
					</div>
					<div>
						<p>Finger Print</p>
					</div>
					<div>
						<p>Please and holde your finger on fingerprint sensor</p>
					</div>

					<div className="flex finger-print">
						<img src={fingerPrintIconSvg} />
					</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default RegisterFingerPrint
