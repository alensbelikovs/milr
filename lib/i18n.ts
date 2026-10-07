export const LOCALES = ["en", "lv"] as const
export const DEFAULT_LOCALE = "en"
export type Locale = typeof LOCALES[number]

// Remembers the language picked in the menu, so a bare URL redirects back to it
export const LOCALE_COOKIE = "NEXT_LOCALE"

// Date and number formatting per site locale
export const INTL_LOCALES: Record<Locale, string> = { en: "en-US", lv: "lv-LV" }

export const hasLocale = (locale: string): locale is Locale => LOCALES.includes(locale as Locale)

// hreflang links to a page's other languages
export const alternates = (path: string) => ({
	languages: Object.fromEntries(LOCALES.map(locale => [locale, `/${locale}${path === "/" ? "" : path}`])),
})
