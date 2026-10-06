import { type ContactPayloadType, type ContactResponseType } from "@/types/ContactTypes"

const FIELDS: (keyof ContactPayloadType)[] = ["name", "email", "subject", "message"]

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
	if (!valid) return json("error", 400)

	// Temporary: only logged until a mail provider is in place
	console.log("Contact form submission:", body)

	return json("success", 200)
}
