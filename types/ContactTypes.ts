// Shared by the contact form and its route handler
export type ContactPayloadType = {
	name: string,
	email: string,
	subject: string,
	message: string
}

// The payload plus its reCAPTCHA token, as posted to the route
export type ContactRequestType = ContactPayloadType & { token: string }

export type ContactStatusType = "success" | "error"

export type ContactResponseType = { status: ContactStatusType }
