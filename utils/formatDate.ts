import { INTL_LOCALES, type Locale } from "@/lib/i18n"

// "January 14, 2026" / "2026. gada 14. janvāris"; UTC so server and client always agree on the day
export default function formatDate(date: string, lang: Locale) {
	return new Date(date).toLocaleDateString(INTL_LOCALES[lang], {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	})
}
