import {
	type ContactPayloadType,
	type ContactRequestType,
	type ContactResponseType,
} from "@/types/ContactTypes"

const FIELDS: (keyof ContactPayloadType)[] = ["name", "email", "subject", "message"]

// Google's suggested cutoff: 1.0 is very likely human, 0.0 very likely a bot
const MIN_SCORE = 0.5

function json(status: ContactResponseType["status"], code: number) {
	return Response.json({ status } satisfies ContactResponseType, { status: code })
}

export async function POST(request: Request) {
	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return json("error", 400)
	}

	// Every field is required and must hold more than whitespace
	const valid = typeof body === "object" && body !== null
		&& FIELDS.every(field => typeof body[field] === "string" && body[field].trim().length > 0)
		&& typeof body.token === "string"
	if (!valid) return json("error", 400)
	const { token, ...payload } = body as ContactRequestType

	try {
		const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			method: "POST",
			body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY!, response: token }),
		})
		const { success, action, score } = await verify.json()
		if (!success || action !== "contact" || score < MIN_SCORE) return json("error", 403)
	} catch {
		return json("error", 502)
	}

	// Temporary: only logged until a mail provider is in place
	console.log("Contact form submission:", payload)

	return json("success", 200)
}
