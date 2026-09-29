// How many cards one grid on /work holds. A page is two of these, so the page size is derived from it
// rather than stated beside it — the page splits its slice at this index, and a page size that was not
// a multiple of it would leave the second grid holding a different number of cards than the first.
export const WORK_GRID_LIMIT = 4

// How many cards a page of /work holds: two full grids. Read by the page to size its slice and to count
// the pages, and by nothing else — Pagination is handed a total rather than working it out again.
export const WORK_PER_PAGE = WORK_GRID_LIMIT * 2

// One place that knows the shape of a /work URL, because three call sites build them and all three
// have to agree exactly: the filter nav, the pagination links, and the page itself when it sends a
// non-canonical URL back to the canonical one.
//
// category and type are slugs, read straight off the documents — both carry a slug field of their own,
// so nothing is derived from a title here.
//
// Defaults are omitted rather than spelled out — no ?page=1, and no ?category= or ?type= for All — so
// every state has exactly one address. Two URLs for the same content is a duplicate to a crawler and a
// second cache entry to the router.
export function workHref(
	{ category = null, type = null, page = 1 }:
	{ category?: string | null, type?: string | null, page?: number }
) {
	const params = new URLSearchParams()

	if (category) params.set("category", category)
	if (type) params.set("type", type)
	if (page > 1) params.set("page", String(page))

	const query = params.toString()
	return query ? `/work?${query}` : "/work"
}
