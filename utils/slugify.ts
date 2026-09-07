// "Best Work" -> "best-work". Section ids are derived from the nav label rather than
// authored separately, so the hash in the address bar says what it points at and the
// two can never drift apart.
export default function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
}
