import { cache } from "react"
import { getLocale } from "@/lib/dictionaries"
import { DEFAULT_LOCALE } from "@/lib/i18n"
import { sanityClient } from "@/utils/sanityClient"
import {
	type CookiesPrivacy,
	type GeneralInformation,
	type Post,
	type Solution,
	type Testimonial,
	type WorkFilter
} from "@/types/CommonTypes"
import { type WorkBroad, type WorkNarrow } from "@/types/WorkTypes"

// A translated field in the request's language, falling back to the default one.
// The last branch passes a plain string through, for documents not yet migrated to translated fields.
const t = (field: string) => `coalesce(
	${field}[language == $lang][0].value,
	${field}[language == "${DEFAULT_LOCALE}"][0].value,
	select(!defined(${field}[0]) => ${field})
)`

const IMG = `"img": img{ "src": @, "alt": ${t("alt")} }`
const WORK_CARD = `"title": ${t("title")}, "slug": slug.current, ${IMG}`
const POST_CARD = `_id, _createdAt, "title": ${t("title")}, "description": ${t("description")}, url, ${IMG}`

// The work is in the chosen sector, has every chosen solution, and is featured if asked; empty means no filter
export const WORK_FILTER = `_type == "work"
	&& (count($sectors) == 0 || count((sector[]->slug.current)[@ in $sectors]) > 0)
	&& count(coalesce(solutions[]->slug.current, [])[@ in $solutions]) == count($solutions)
	&& (!$featured || featured == true)`

// cache() so the layout and the home page share one request per render
export const getGeneralInformation = cache(async (): Promise<GeneralInformation | null> => {
	return await sanityClient.fetch(
		`*[_id == "generalInformation"][0]{
			${IMG},
			email,
			phone,
			socials[]{ _key, title, url },
			hours,
			address{ ..., "city": ${t("city")}, "country": ${t("country")} }
		}`,
		{ lang: await getLocale() }
	)
})

export async function getCookiesPrivacy(): Promise<CookiesPrivacy | null> {
	return await sanityClient.fetch(
		`*[_id == "cookiesPrivacy"][0]{ effectiveDate, updatedDate, "body": ${t("body")} }`,
		{ lang: await getLocale() }
	)
}

// Sorted after projecting, so titles sort in the request's language
export async function getSectors(): Promise<WorkFilter[]> {
	return await sanityClient.fetch(
		`*[_type == "sector"]{ "title": ${t("title")}, "slug": slug.current } | order(title asc)`,
		{ lang: await getLocale() }
	)
}

export async function getSolutions(): Promise<Solution[]> {
	return await sanityClient.fetch(
		`*[_type == "solution"]{
			"title": ${t("title")},
			"slug": slug.current,
			"description": ${t("description")},
			${IMG}
		} | order(title asc)`,
		{ lang: await getLocale() }
	)
}

// _id breaks ties so a work never lands on two pages
export async function getWork(
	{ sectors, solutions, featured, start, end }: {
		sectors: string[],
		solutions: string[],
		featured: boolean,
		start: number,
		end: number
	}): Promise<{ work: WorkNarrow[], count: number }> {
	return await sanityClient.fetch(
		`{
			"work": *[${WORK_FILTER}] | order(_createdAt desc, _id desc)[$start...$end]{ ${WORK_CARD} },
			"count": count(*[${WORK_FILTER}])
		}`,
		{ sectors, solutions, featured, start, end, lang: await getLocale() }
	)
}

export async function getLatestWork(
	{ limit, except = "" }: { limit: number, except?: string }): Promise<WorkNarrow[]> {
	return await sanityClient.fetch(
		`*[_type == "work" && slug.current != $except] | order(_createdAt desc)[0...$limit]{ ${WORK_CARD} }`,
		{ limit, except, lang: await getLocale() }
	)
}

// cache() so the page and its metadata share one request
export const getWorkBySlug = cache(async (slug: string): Promise<WorkBroad | null> => {
	return await sanityClient.fetch(
		`*[_type == "work" && slug.current == $slug][0]{
			${WORK_CARD},
			_createdAt,
			"subtitle": ${t("subtitle")},
			"description": ${t("description")},
			"sector": coalesce(sector[]{ _key, ...@->{ "title": ${t("title")}, "slug": slug.current } }, []),
			"solutions": coalesce(solutions[]{ _key, ...@->{
				"title": ${t("title")},
				"slug": slug.current,
				"description": ${t("description")},
				${IMG}
			} }, []),
			location{ "city": ${t("city")}, "country": ${t("country")} },
			area,
			testimonial->{ "text": ${t("text")}, "author": ${t("author")}, "description": ${t("description")} },
			"gallery": coalesce(gallery[]{
				_key,
				"src": @,
				"alt": ${t("alt")},
				"aspectRatio": asset->metadata.dimensions.aspectRatio
			}, [])
		}`,
		{ slug, lang: await getLocale() }
	)
})

export async function getRandomTestimonial(): Promise<Testimonial | null> {
	const testimonials = await sanityClient.fetch<Testimonial[]>(
		`*[_type == "testimonial"]{ "text": ${t("text")}, "author": ${t("author")}, "description": ${t("description")} }`,
		{ lang: await getLocale() }
	)
	return testimonials[Math.floor(Math.random() * testimonials.length)] ?? null
}

export async function getPosts(limit: number): Promise<Post[]> {
	return await sanityClient.fetch(
		`*[_type == "post"] | order(_createdAt desc)[0...$limit]{ ${POST_CARD} }`,
		{ limit, lang: await getLocale() }
	)
}

export async function getPostsPage(
	{ start, end }: { start: number, end: number }): Promise<{ posts: Post[], count: number }> {
	return await sanityClient.fetch(
		`{
			"posts": *[_type == "post"] | order(_createdAt desc, _id desc)[$start...$end]{ ${POST_CARD} },
			"count": count(*[_type == "post"])
		}`,
		{ start, end, lang: await getLocale() }
	)
}
