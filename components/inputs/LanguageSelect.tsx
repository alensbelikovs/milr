"use client"
import { Fragment } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useSite } from "@/components/layout/SiteProvider"
import { LOCALE_COOKIE, LOCALES } from "@/lib/i18n"

// EN / LV switch in the menu: one link to the same page and query in the other locale.
// The choice goes in a cookie, so a bare URL later redirects back to it.
export default function LanguageSelect() {
	const { lang } = useSite()
	const pathname = usePathname()
	const query = useSearchParams().toString()
	const rest = pathname.slice(`/${lang}`.length)
	const other = LOCALES.find(locale => locale !== lang) ?? lang

	return (
		<Link
			href={`/${other}${rest}${query ? `?${query}` : ""}`}
			hrefLang={other}
			onClick={() => { document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=31536000` }}
			className="group text-size-16 flex items-center gap-size-12 uppercase">
			{LOCALES.map((locale, index) => (
				<Fragment key={locale}>
					{index > 0 && <span className="text-foreground">/</span>}
					<span className={locale === lang ? "text-foreground" : "text-foreground/50 group-hover:underline"}>
						{locale}
					</span>
				</Fragment>
			))}
		</Link>
	)
}
