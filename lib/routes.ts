// This file contains all site routes in one place so transition layer,
// and navigation client components have one SSOT for routes

export type Route = { href: string; label: string }

// Kept out of cycle, because renders first,
// except case when already in /contact
const CONTACT: Route = { href: "/contact", label: "Contact" }

// The reading order of the site, and the order getNavList cycles through. A route added here shows
// up in every nav list automatically, in the position it is written
const CYCLE: Route[] = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/projects", label: "Projects" },
	{ href: "/diary", label: "Diary" },
]

// Used by navbar, but kept here to edit
// quickly and in the same place as all routes
export const STATIC_ROUTES: Route[] = [
	{ href: "about", label: "About" },
	{ href: "/projects", label: "Projects" },
	{ href: "/diary", label: "Diary" },
	{ href: "/contact", label: "Contact" },
]

// Every route the site has for dynamic lists for ease of use
export const ROUTES: Route[] = [...CYCLE, CONTACT]

// Checks the passed pathname against the list to build the route list
export const matchRoute = (pathname: string): Route | null =>
	ROUTES.find(route => route.href === pathname) ?? null

// Builds the dynamic navigation list to map over in client components
// Displays contact first in all cases, except when already in /contact
export function getNavList(pathname: string): Route[] {
	const current = matchRoute(pathname)
	const at = current ? CYCLE.indexOf(current) : -1

	// Everything after the current page,
	// then everything before it. Index `at` is in neither
	// slice, which is how the current page is excluded
	const cycled = at === -1
		? CYCLE
		: [...CYCLE.slice(at + 1), ...CYCLE.slice(0, at)]

	return current === CONTACT ? cycled : [CONTACT, ...cycled]
}
