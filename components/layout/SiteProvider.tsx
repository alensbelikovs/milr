"use client"
import { createContext, useContext } from "react"
import { type Dictionary } from "@/lib/dictionaries"
import { type Locale } from "@/lib/i18n"
import { type GeneralInformation } from "@/types/CommonTypes"

type Site = { lang: Locale, dict: Dictionary, information: GeneralInformation | null }

// Context rather than a store: on the server a store is shared by every request, whatever its locale
const SiteContext = createContext<Site | null>(null)

// Hands the layout's locale, dictionary and general information to client components
export default function SiteProvider({ children, ...site }: Site & { children: React.ReactNode }) {
	return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSite() {
	const site = useContext(SiteContext)
	if (!site) throw new Error("useSite must be used inside SiteProvider")
	return site
}
