import { sanityClient } from "@/utils/sanityClient"
import { type WorkFilter, type GeneralInformation } from "@/types/CommonTypes"
import { type SolutionType, type WorkNarrow } from "@/types/WorkTypes"
import { cache } from "react"

const GENERAL_INFORMATION_QUERY = `*[_id == "generalInformation"][0]{
	"img": img{ "src": @, alt },
	email,
	phone,
	socials[]{ _key, title, url },
	hours,
	address
}`

const ALL_WORK_SECTORS_QUERY =
	`*[_type == "sector"] | order(title asc){ title, "slug": slug.current }`

const ALL_WORK_TYPES_QUERY =
	`*[_type == "solution"] | order(title asc){
		title,
		"slug": slug.current,
		description,
		"img": img{ "src": @, alt }
	}`

// Work narrowed by the filters. Each filter is a list of slugs, and a work's sector and solutions are
// each lists of references — so a work matches a filter when any of its own slugs is in the list:
// pick two sectors and you get the work of both. The two filters narrow together, and an empty list is
// that filter not applied.
const WORK_FILTER = `_type == "work"
	&& (count($sectors) == 0 || count((sector[]->slug.current)[@ in $sectors]) > 0)
	&& (count($solutions) == 0 || count((solutions[]->slug.current)[@ in $solutions]) > 0)`

// A slice of the filtered work, and how many there are in all so the caller can count pages. Newest
// first; _id breaks ties so a piece can never land on two pages, or none.
const WORK_QUERY = `{
	"work": *[${WORK_FILTER}] | order(_createdAt desc, _id desc)[$start...$end]{
		title,
		"slug": slug.current,
		"img": img{ "src": @, alt }
	},
	"count": count(*[${WORK_FILTER}])
}`

// start/end are slice bounds rather than a page number: turning a page into an offset is the page's
// arithmetic, and this stays a plain range.
export async function getWork(
	{ sectors = [], solutions = [], start, end }: {
		sectors?: string[],
		solutions?: string[],
		start: number,
		end: number
	}
): Promise<{ work: WorkNarrow[], count: number }> {
	return await sanityClient.fetch(WORK_QUERY, { sectors, solutions, start, end })
}

export async function getAllWorkSectors(): Promise<WorkFilter[]> {
	return await sanityClient.fetch<WorkFilter[]>(ALL_WORK_SECTORS_QUERY)
}

export async function getAllWorkTypes(): Promise<SolutionType[]> {
	return await sanityClient.fetch<SolutionType[]>(ALL_WORK_TYPES_QUERY)
}

export const getGeneralInformation = cache(
	async (): Promise<GeneralInformation | null> =>
		await sanityClient.fetch<GeneralInformation | null>(
			GENERAL_INFORMATION_QUERY,
			{},
			{ next: { revalidate: 3600 } })
)
