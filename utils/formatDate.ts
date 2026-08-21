// Long-form dates for anything with a published or created stamp on it — "January 14, 2026".
//
// Normalized through the Date constructor rather than used as passed, because the type is optimistic:
// Sanity's _createdAt is typed as a Date but arrives over the wire as an ISO string, and the
// constructor takes either — a Date is copied, a string is parsed.
//
// Pinned to UTC so a timestamp near midnight resolves to the same calendar day wherever it is
// rendered. Without it the server formats in UTC and the browser in the visitor's zone, and a late
// evening stamp comes out a day apart in the two — which React reports as a hydration mismatch.
export default function formatDate(date: Date) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	})
}
