// Whether following this href would land exactly where the page already is — the click WorkHeader
// and WorkHeaderCategory each guard by hand, asked generically so the shared link components can
// guard it too.
//
// Left alone that click is a real navigation: the router runs it, refetches the tree and hands fresh
// children down, and TransitionControl — which sees new children and cannot tell they render the same
// thing — spends the whole curtain sequence arriving back exactly where it started.
//
// Read off window rather than usePathname, and it is not an optimisation. The comparison needs the
// query too, and the hook that carries it is useSearchParams, which drags a Suspense boundary into
// every page that renders one of these links. This is only ever called from a click handler, which by
// definition runs in the browser after hydration, so the browser's own address is both available and
// more complete than any hook.
//
// Answers false whenever it cannot be certain, because the cost of the two mistakes is not the same:
// a missed guard is one redundant transition, where a wrong guard is a link that does nothing.
export default function clickChangesNothing(href: string, target = "_self") {
	// Called during SSR by nothing, but a guard costs less than the assumption.
	if (typeof window === "undefined") return false

	// A new tab showing this page is not the page staying still — cancelling that click would be
	// swallowing a navigation the reader asked for.
	if (target !== "_self") return false

	let destination: URL
	try {
		destination = new URL(href, window.location.href)
	} catch {
		// An href the URL parser cannot resolve is not one this can claim goes nowhere. mailto: and
		// tel: parse fine and fall out at the origin check below, which is where they belong.
		return false
	}

	const here = window.location

	// Every part has to match, hash included. A bare "#section" resolves to this same path and search
	// and would look like a no-op, when it is the one kind of same-page navigation that does something.
	return destination.origin === here.origin
		&& destination.pathname === here.pathname
		&& destination.search === here.search
		&& destination.hash === here.hash
}
