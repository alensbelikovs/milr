import { notFound } from "next/navigation"
import { lang } from "next/root-params"
import { hasLocale, type Locale } from "@/lib/i18n"
import type en from "@/dictionaries/en.json"

export type Dictionary = typeof en

// Typed against en.json, so a key missing from another language fails the build
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
	en: () => import("@/dictionaries/en.json").then(module => module.default),
	lv: () => import("@/dictionaries/lv.json").then(module => module.default),
}

// The current request's locale, read from the [lang] segment; an unknown one is a 404
export async function getLocale(): Promise<Locale> {
	const locale = await lang()
	if (!hasLocale(locale)) notFound()
	return locale
}

export async function getDictionary() {
	return dictionaries[await getLocale()]()
}
