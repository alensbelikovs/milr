"use client"
import Link from "next/link"
import { type ComponentProps } from "react"
import { useSite } from "@/components/layout/SiteProvider"

// next/link that keeps internal paths in the current locale; mailto:, tel:, #ids and full urls pass through
export default function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
	const { lang } = useSite()
	const prefix = (path: string) => path.startsWith("/") ? `/${lang}${path === "/" ? "" : path}` : path

	return (
		<Link
			href={typeof href === "string" ? prefix(href) : { ...href, pathname: href.pathname && prefix(href.pathname) }}
			{...props} />
	)
}
