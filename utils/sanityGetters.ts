import { cache } from "react"
import { sanityClient } from "@/utils/sanityClient"
import {
	type GeneralInformation,
	type Post,
	type Solution,
	type Testimonial,
	type WorkFilter
} from "@/types/CommonTypes"
import { type WorkBroad, type WorkNarrow } from "@/types/WorkTypes"

const IMG = `"img": img{ "src": @, alt }`
const WORK_CARD = `title, "slug": slug.current, ${IMG}`
const POST_CARD = `_id, _createdAt, title, description, url, ${IMG}`

// A work matches a filter when any of its slugs is in the list; an empty list means no filter
export const WORK_FILTER = `_type == "work"
	&& (count($sectors) == 0 || count((sector[]->slug.current)[@ in $sectors]) > 0)
	&& (count($solutions) == 0 || count((solutions[]->slug.current)[@ in $solutions]) > 0)`

// cache() so the layout and the home page share one request per render
export const getGeneralInformation = cache(async (): Promise<GeneralInformation | null> => {
	return await sanityClient.fetch(`*[_id == "generalInformation"][0]{
		${IMG},
		email,
		phone,
		socials[]{ _key, title, url },
		hours,
		address
	}`)
})

export async function getSectors(): Promise<WorkFilter[]> {
	return await sanityClient.fetch(`*[_type == "sector"] | order(title asc){ title, "slug": slug.current }`)
}

export async function getSolutions(): Promise<Solution[]> {
	return await sanityClient.fetch(
		`*[_type == "solution"] | order(title asc){ title, "slug": slug.current, description, ${IMG} }`
	)
}

// _id breaks ties so a work never lands on two pages
export async function getWork(
	{ sectors, solutions, start, end }: {
		sectors: string[],
		solutions: string[],
		start: number,
		end: number
	}): Promise<{ work: WorkNarrow[], count: number }> {
	return await sanityClient.fetch(
		`{
			"work": *[${WORK_FILTER}] | order(_createdAt desc, _id desc)[$start...$end]{ ${WORK_CARD} },
			"count": count(*[${WORK_FILTER}])
		}`,
		{ sectors, solutions, start, end }
	)
}

export async function getLatestWork(
	{ limit, except = "" }: { limit: number, except?: string }): Promise<WorkNarrow[]> {
	return await sanityClient.fetch(
		`*[_type == "work" && slug.current != $except] | order(_createdAt desc)[0...$limit]{ ${WORK_CARD} }`,
		{ limit, except }
	)
}

export async function getWorkBySlug(slug: string): Promise<WorkBroad | null> {
	return await sanityClient.fetch(
		`*[_type == "work" && slug.current == $slug][0]{
			${WORK_CARD},
			_createdAt,
			subtitle,
			description,
			"sector": coalesce(sector[]{ _key, "title": @->title, "slug": @->slug.current }, []),
			"solutions": coalesce(solutions[]{
				_key,
				"title": @->title,
				"slug": @->slug.current,
				"description": @->description,
				"img": @->img{ "src": @, alt }
			}, []),
			location,
			area,
			testimonial->{ text, author, description },
			"gallery": coalesce(gallery[]{
				_key,
				"src": @,
				alt,
				"aspectRatio": asset->metadata.dimensions.aspectRatio
			}, [])
		}`,
		{ slug }
	)
}

export async function getRandomTestimonial(): Promise<Testimonial | null> {
	const testimonials = await sanityClient.fetch<Testimonial[]>(
		`*[_type == "testimonial"]{ text, author, description }`
	)
	return testimonials[Math.floor(Math.random() * testimonials.length)] ?? null
}

export async function getPosts(limit: number): Promise<Post[]> {
	return await sanityClient.fetch(
		`*[_type == "post"] | order(_createdAt desc)[0...$limit]{ ${POST_CARD} }`,
		{ limit }
	)
}

export async function getPostsPage(
	{ start, end }: { start: number, end: number }): Promise<{ posts: Post[], count: number }> {
	return await sanityClient.fetch(
		`{
			"posts": *[_type == "post"] | order(_createdAt desc, _id desc)[$start...$end]{ ${POST_CARD} },
			"count": count(*[_type == "post"])
		}`,
		{ start, end }
	)
}
