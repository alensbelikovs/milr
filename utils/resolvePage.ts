import { notFound } from "next/navigation"

// Reads ?page= as a number: missing is page 1, anything that isn't an integer is a 404
export default function resolvePage(param: string | string[] | undefined) {
	const raw = Array.isArray(param) ? param[0] : param
	if (raw === undefined) return 1

	const page = Number(raw)
	if (!Number.isInteger(page)) notFound()
	return Math.max(1, page)
}
