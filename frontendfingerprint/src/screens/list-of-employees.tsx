import React, {useEffect} from "react"
import {
	IonContent,
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonIcon,
} from "@ionic/react"
import axios from "axios"
import {performBiometricVerificatin} from "../service/finger-print"
import {useHistory} from "react-router-dom"

const ListOfEmployees: React.FC<any> = () => {
	const history = useHistory()

	const employeeList = [
		{
			id: "1232",
			name: "Navani",
		},
		{
			id: "4571",
			name: "Sundar",
		},
		{
			id: "7820",
			name: "Yogesh",
		},
	]

	const [showRegisterFingerPrnt, setShowRegisterFingerPrnt] =
		React.useState<boolean>(false)

	const [showLoginFingerPrnt, setShowLoginFingerPrnt] =
		React.useState<boolean>(false)

	const handleClickEmployee = (employeeId: string) => async (e: any) => {
		console.log("employeeId :::=> ", employeeId)
		let response: any = null
		try {
			response = await axios
				.get(`https://6f8c-157-46-213-29.in.ngrok.io/${employeeId}`)
				.then((value: any) => {
					console.log("value data ::: =>", value.data)
					return value.data
				})
				.catch((error: any) => {
					console.log("axios error value :::", error)
				})
			console.log("response :::", response)
		} catch (error) {
			console.log("error response :::", error)
		}

		if (response?.data) {
			const {id, name, fingerPrint} = response.data
			//user finger print exists show login screen or register finger print screen
			history.push(
				!!fingerPrint
					? `/login?id=${id}&name=${name}`
					: `/register?id=${id}&name=${name}`
			)
		}
	}

	const getFingerPrintStatus = async () => {
		const result = await performBiometricVerificatin().then()
		return result
	}

	useEffect(() => {
		const isAvailFingerPrint: any = getFingerPrintStatus()
		console.log("isAvailFingerPrint ::", isAvailFingerPrint)

		if (isAvailFingerPrint) {
			setShowRegisterFingerPrnt(isAvailFingerPrint)
		}
	}, [])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>All Employees</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<div className="flex flex-col">
					{employeeList.map(({id, name}) => {
						return (
							<div
								key={id}
								onClick={handleClickEmployee(id)}
								className="flex w-full h-5 py-6 border-b-[1px]">
								{" "}
								<p className="flex text-center">{name}</p>
							</div>
						)
					})}
				</div>
			</IonContent>
		</IonPage>
	)
}

export default ListOfEmployees
