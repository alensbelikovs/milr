// This file contains all site routes in one place so navigation components have one SSOT for routes

export type Route = { href: string; label: string }

// The nav list rendered by the footer and the sidebar menu, in this fixed order. Kept here to edit
// quickly and in the same place as all routes
export const STATIC_ROUTES: Route[] = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/work", label: "Work" },
	{ href: "/diary", label: "Diary" },
	{ href: "/contact", label: "Contact" },
]
