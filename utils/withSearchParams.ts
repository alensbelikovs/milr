// A path with a query, built from whatever params a caller has, for any route. Empty values — null,
// undefined, "" — are dropped rather than written out as ?key=, so a default (All, no filter) has no
// param at all and every state keeps exactly one address. Two URLs for the same content is a
// duplicate to a crawler and a second cache entry to the router.
//
// An array keeps its first value, the same rule utils/firstParam applies to what a page reads — so
// a page's own searchParams can be handed straight in.
export default function withSearchParams(
	pathname: string,
	params: Record<string, string | string[] | number | null | undefined>
) {
	const search = new URLSearchParams()

	for (const [key, raw] of Object.entries(params)) {
		const value = Array.isArray(raw) ? raw[0] : raw
		if (value !== null && value !== undefined && value !== "") search.set(key, String(value))
	}

	const query = search.toString()
	return query ? `${pathname}?${query}` : pathname
}
