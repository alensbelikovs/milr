export type Route = { href: string, label: string }

// Site routes in nav order, shared by the main nav, footer and sidebar menu
export const STATIC_ROUTES: Route[] = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/work", label: "Work" },
	{ href: "/diary", label: "Diary" },
	{ href: "/contact", label: "Contact" },
]
