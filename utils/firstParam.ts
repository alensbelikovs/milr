// A repeated key comes back as an array — ?page=1&page=2 — and the first one is the answer.
// Reading it straight would hand an array to a string comparison that then silently never matches.
//
// Shared by every page that reads searchParams rather than redeclared in each, because two copies of
// a normaliser is two chances for one of them to start disagreeing about what a repeated key means.
export const first = (value: string | string[] | undefined) =>
	Array.isArray(value) ? value[0] : value
