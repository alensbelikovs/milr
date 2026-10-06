// Shared by the contact form and its route handler
export type ContactPayloadType = {
	name: string,
	email: string,
	subject: string,
	message: string
}

export type ContactStatusType = "success" | "error"

export type ContactResponseType = { status: ContactStatusType }
