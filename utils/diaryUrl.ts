// How many cards a page of /diary holds. Read by the page to size its slice and to count the pages,
// and by nothing else — Pagination is handed a total rather than working it out again.
//
// Twelve because the shared placement rhythm is six entries long — see gridVariants. variantAt
// wraps by index within the page, so a page size that is a multiple of the rhythm gives every page
// complete cycles of it, two here, where a size like eight would leave the last cards of a page
// repeating the first cards placement against a rhythm whose negative margins and cycle break are
// tuned to where a cycle lands, not to a fragment of one.
export const POSTS_PER_PAGE = 12

// One place that knows the shape of a /diary URL, because two call sites build them and both have to
// agree exactly: the pagination links, and the page itself when it sends a non-canonical URL back to
// the canonical one.
//
// No category here, and no room for one: a post references nothing — see SCHEMA.md — so a page
// number is the whole of this route's state. That is the one way this parts company with
// workHref, which carries a filter alongside the page.
//
// The default is omitted rather than spelled out — no ?page=1 — so every state has exactly one
// address. Two URLs for the same content is a duplicate to a crawler and a second cache entry to the
// router.
export function diaryHref({ page = 1 }: { page?: number } = {}) {
	return page > 1 ? `/diary?page=${page}` : "/diary"
}
