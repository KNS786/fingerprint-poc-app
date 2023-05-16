import {NativeBiometric} from "capacitor-native-biometric"

export const performBiometricVerificatin = async () => {
	const result = await NativeBiometric.isAvailable()
	if (!result.isAvailable) return

	const verified = await NativeBiometric.verifyIdentity({
		reason: "For easy log in",
		title: "Log in",
		subtitle: "Maybe add subtitle here?",
		description: "Maybe a description too?",
	})
		.then((value: any) => {
			console.log("fingerprint token::::=> ", value)
			return true
		})
		.catch(() => false)

	console.log("verified ::: =>", verified)
	if (!verified) return
	return verified
}

// NativeBiometric.setCredentials()
