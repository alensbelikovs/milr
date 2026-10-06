// "January 14, 2026"; UTC so server and client always agree on the day
export default function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	})
}
