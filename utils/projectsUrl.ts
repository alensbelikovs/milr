// How many cards a page of /projects holds. Read by the page to size its slice and to count the
// pages, and by nothing else — Pagination is handed a total rather than working it out again.
//
// Five because that is the length of ProjectGrid's placement rhythm. variantAt wraps by index within
// the page, so a page size that is a multiple of the rhythm gives every page a complete cycle; six
// would leave the last card of each page repeating the first card's placement, and the negative
// margins in that rhythm are tuned to where a cycle lands, not to a fragment of one.
export const PROJECTS_PER_PAGE = 5

// The category document carries a title and nothing else — see SCHEMAS.md — so the URL segment is
// derived from the title rather than read off a field.
//
// Derived here in TS rather than matched inside the query, because the page holds the category list
// already (the chips are built from it): it can find the category whose slug matches and filter on
// that document's _id. Exact, no join, and no string transform inside GROQ that would have to be
// kept in step with this one.
export function categorySlug(title: string) {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

// One place that knows the shape of a /projects URL, because three call sites build them and all
// three have to agree exactly: the category chips, the pagination links, and the page itself when it
// sends a non-canonical URL back to the canonical one.
//
// Defaults are omitted rather than spelled out — no ?page=1, and no ?category= for All — so every
// state has exactly one address. Two URLs for the same content is a duplicate to a crawler and a
// second cache entry to the router.
export function projectsHref({ category = null, page = 1 }: { category?: string | null, page?: number }) {
	const params = new URLSearchParams()

	if (category) params.set("category", category)
	if (page > 1) params.set("page", String(page))

	const query = params.toString()
	return query ? `/projects?${query}` : "/projects"
}
