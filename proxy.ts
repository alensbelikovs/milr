import { NextResponse, type NextRequest } from "next/server"
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, hasLocale } from "@/lib/i18n"

// Picks the menu choice first, then the browser's languages in order of preference
function getLocale(request: NextRequest) {
	const cookie = request.cookies.get(LOCALE_COOKIE)?.value
	if (cookie && hasLocale(cookie)) return cookie

	const languages = (request.headers.get("accept-language") ?? "")
		.split(",")
		.map(part => part.split(";")[0].trim().slice(0, 2).toLowerCase())
	return languages.find(hasLocale) ?? DEFAULT_LOCALE
}

// Every page lives under /en or /lv; a path without a locale is redirected to one
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const hasPrefix = LOCALES.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
	if (hasPrefix) return

	request.nextUrl.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`
	return NextResponse.redirect(request.nextUrl)
}

// Skips internals, the API and anything with a file extension
export const config = {
	matcher: ["/((?!_next|api|.*\\..*).*)"],
}
