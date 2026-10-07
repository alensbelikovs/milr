import { type Dictionary } from "@/lib/dictionaries"

export type Route = { href: string, key: keyof Dictionary["nav"] }

// Site routes in nav order, shared by the main nav, footer and sidebar menu; labels come from dict.nav
export const STATIC_ROUTES: Route[] = [
	{ href: "/", key: "home" },
	{ href: "/about", key: "about" },
	{ href: "/work", key: "work" },
	{ href: "/diary", key: "diary" },
	{ href: "/contact", key: "contact" },
]
