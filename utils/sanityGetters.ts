import { sanityClient } from "@/utils/sanityClient"
import { CategoryListType, ProjectListType, ProjectShowType, VideoBlogType } from "@/types/ContentTypes"

// Cards for a project grid: the bare slug, the title, and the cover as an image source rather than a
// finished URL. Sizing is the call site's business — see buildImageUrl — so the query hands over the
// asset reference and lets a card ask for card dimensions and a hero ask for 2K.
//
// category is a reference, so it needs the -> to resolve, and it is flattened to the title on the way
// out: the card prints that string and has no use for the document behind it.
//
// Shared between the two queries below rather than written twice, because both feed the same
// ProjectListType and a field added to one and missed on the other is a card that renders blank on
// one route and not the other.
const PROJECT_CARD_PROJECTION = `{
	"slug": slug.current,
	title,
	img,
	"category": category->title
}`

// Ordered by title descending because the titles are sequential codes: MR-008 sorts above MR-007, so
// the newest work leads without a second field to keep in step with it.
//
// The slice bound is a parameter, so this one query serves whatever limit a caller asks for.
const PROJECTS_QUERY =
	`*[_type == "project"] | order(title desc)[0...$limit]${PROJECT_CARD_PROJECTION}`

// One page of projects, optionally narrowed to a category.
//
// A null $categoryId is the unfiltered case rather than a second query: the || short-circuits, the
// filter collapses to *[_type == "project"], and one query serves both the All view and every
// category view. Filtering on category._ref rather than category->title keeps it a plain field
// comparison — no join to evaluate per document — and stays exact if two categories are ever given
// the same title.
//
// Ordered by title descending as above, and here that ordering is what makes paging *correct*, not
// merely consistent. The codes are unique, so the sort is total: no two documents can trade places
// between the count request and the slice request and slide a project across a page boundary, where
// it would show up twice or not at all.
const PROJECTS_PAGE_QUERY =
	`*[_type == "project" && ($categoryId == null || category._ref == $categoryId)]
		| order(title desc)[$start...$end]${PROJECT_CARD_PROJECTION}`

// Projects counted server-side rather than by measuring a fetched array: the callers that want this
// number are the ones showing a limited slice of it. Takes the same optional filter as the page
// query above, so the pagination is counting the set it is actually paging through.
const PROJECTS_COUNT_QUERY =
	`count(*[_type == "project" && ($categoryId == null || category._ref == $categoryId)])`

// Every category with the number of projects carrying it, which is both what the chips print and
// what decides whether a chip is worth rendering at all.
//
// Counted from the project side because the reference only points one way — see SCHEMAS.md. The ^
// climbs out of the subquery to the category being projected, so each row counts its own.
const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc){
	_id,
	title,
	"count": count(*[_type == "project" && references(^._id)])
}`

// One project by slug, with every field the document carries. The cover stays an image source, as in
// the card projection above, and its alt text is hoisted out beside it so a project reads as one flat
// shape everywhere rather than something callers reach into.
const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
	"slug": slug.current,
	title,
	img,
	"alt": img.alt,
	location,
	year,
	"category": category->title,
	description,
	testimonial
}`

// A filter always projects to an array, so an empty studio comes back as [] rather than null and
// callers decide what "no projects" looks like by measuring it.
export async function getProjects(limit: number): Promise<ProjectListType[]> {
	return await sanityClient.fetch<ProjectListType[]>(PROJECTS_QUERY, { limit })
}

// One page of the same, narrowed to a category when one is given. start/end are the slice bounds
// rather than a page number: the arithmetic that turns a page into an offset belongs to the caller
// showing the pages, and this stays a plain range.
export async function getProjectsPage(
	{ categoryId, start, end }:
	{ categoryId: string | null, start: number, end: number }
): Promise<ProjectListType[]> {
	return await sanityClient.fetch<ProjectListType[]>(PROJECTS_PAGE_QUERY, { categoryId, start, end })
}

// Defaults to the whole studio, so the callers that predate the filter keep working unchanged.
export async function getProjectsCount(categoryId: string | null = null): Promise<number> {
	return await sanityClient.fetch<number>(PROJECTS_COUNT_QUERY, { categoryId })
}

export async function getCategories(): Promise<CategoryListType[]> {
	return await sanityClient.fetch<CategoryListType[]>(CATEGORIES_QUERY)
}

// Null when the slug matches nothing — [0] over an empty result set is null — which is the signal
// callers turn into a 404.
export async function getProject(slug: string): Promise<ProjectShowType | null> {
	return await sanityClient.fetch<ProjectShowType | null>(PROJECT_QUERY, { slug })
}

// Every video blog the grid needs, whole. There is no second query behind this one: a blog has no
// page of its own, it opens in a modal the grid already holds, and the only fields that view adds
// over the card are mediaUrl and description. Both are cheap enough to carry on every card that
// fetching them up front beats a round trip on open.
//
// The cover stays an image source, as in the project cards above, so sizing stays the call site's
// decision.
//
// _createdAt is asked for by name: it is a system field, so it comes back only when the projection
// says so, and both the ordering here and the date on the card are read off it.
//
// Ordered newest first, matching the studio's createdAtDesc ordering — which is a sort option for
// editors and does nothing to a query, so it has to be restated here.
const VIDEO_BLOGS_QUERY = `*[_type == "videoBlog"] | order(_createdAt desc)[0...$limit]{
	"slug": slug.current,
	title,
	img,
	_createdAt,
	mediaUrl,
	description
}`

// Every video blog in the studio, counted server-side for the same reason the project count is: the
// callers wanting the number are showing a limited slice of it.
const VIDEO_BLOGS_COUNT_QUERY = `count(*[_type == "videoBlog"])`

export async function getVideoBlogs(limit: number): Promise<VideoBlogType[]> {
	return await sanityClient.fetch<VideoBlogType[]>(VIDEO_BLOGS_QUERY, { limit })
}

export async function getVideoBlogsCount(): Promise<number> {
	return await sanityClient.fetch<number>(VIDEO_BLOGS_COUNT_QUERY)
}
