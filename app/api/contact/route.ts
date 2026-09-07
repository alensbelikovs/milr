import type { ContactPayloadType, ContactResponseType } from "@/types/ContactTypes"

const FIELDS = ["name", "email", "subject", "message"] as const

// Narrows the parsed body to a payload. Every field is required and must carry something other
// than whitespace, which mirrors the `required` attributes the form already enforces natively —
// the browser is not the last word on what arrives here.
function isPayload(body: unknown): body is ContactPayloadType {
	if (typeof body !== "object" || body === null) return false
	const record = body as Record<string, unknown>
	return FIELDS.every(field =>
		typeof record[field] === "string" && (record[field] as string).trim().length > 0)
}

function json(status: ContactResponseType["status"], code: number) {
	return Response.json({ status } satisfies ContactResponseType, { status: code })
}

// POST is never cached, so this needs no route segment config.
export async function POST(request: Request) {
	let body: unknown

	try {
		body = await request.json()
	} catch {
		return json("error", 400)
	}

	if (!isPayload(body)) return json("error", 400)

	// The whole "backend" for now: nothing is mailed or stored, the submission is only logged to
	// the server console. Replace with the actual send when the mail provider is in place.
	console.log("Contact form submission:", body)

	return json("success", 200)
}
