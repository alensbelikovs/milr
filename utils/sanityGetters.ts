import { sanityClient } from "@/utils/sanityClient"
import { CategoryListType, ProjectListType, ProjectShowType, TestimonialType, VideoBlogType } from "@/types/ContentTypes"

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
//
// Both references need the -> to resolve, and they resolve to different shapes because the two are
// wanted for different things. category collapses to its title, as in the card projection: the page
// prints that string and has no use for the document behind it. testimonial keeps an object, because
// the quote travels with the _id that identifies it, and a bare string could not be told apart from
// the same words on another document. Left bare, the field would come back as {_ref, _type} — the
// pointer rather than the quote.
//
// The testimonial reference is optional in the schema, so this projects to null on a project without
// one. That is the whole of the empty case: no missing-key check for callers, just a null to test.
//
// It projects the same four fields the standalone testimonials query does, _id included, so both
// paths hand back one TestimonialType. The _id earns nothing here — there is no list to key — but a
// second shape for the same document would be two things to keep in step, and this is one field.
//
// gallery needs no -> at all: its images are inline on the project document — see SCHEMA.md — so the
// array comes back whole, in the order the editor arranged it. Each item is projected rather than
// taken bare so the _key comes with it, which is the only stable identity an array item has and the
// only thing a React key may be: an index would be reused by whichever picture moved into that slot
// when the gallery is reordered, and SCHEMA.md notes it breaks Visual Editing overlays too.
//
// "img": @ hands over the item itself, hotspot and crop included, which is what makes it an image
// source buildImageUrl can size. SCHEMA.md's own example expands asset->{url, metadata} instead; that
// is the general-purpose shape, and this file does not take it — a finished URL would settle the size
// here rather than at the call site, and nothing on a project page reads lqip or dimensions. Project
// them the day something wants blur placeholders.
//
// coalesce, so a project with no gallery yields [] rather than null: an array projection over a
// missing field is null, and every caller would be one guard away from crashing on .map.
const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
	"slug": slug.current,
	title,
	img,
	"alt": img.alt,
	"gallery": coalesce(gallery, [])[]{
		_key,
		"img": @
	},
	location,
	year,
	"category": category->title,
	description,
	testimonial->{
		_id,
		testimonial,
		author,
		authorDetail
	}
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

// Everything a video blog needs, wherever it appears. There is no second, fuller query behind this
// one: a blog has no page of its own, it opens in a modal the grid already holds, and the only
// fields that view adds over the card are mediaUrl and description. Both are cheap enough to carry
// on every card that fetching them up front beats a round trip on open.
//
// The cover stays an image source, as in the project cards above, so sizing stays the call site's
// decision.
//
// _createdAt is asked for by name: it is a system field, so it comes back only when the projection
// says so, and the ordering, the date on the card and the date in the modal are all read off it.
//
// Shared between the two queries below for the same reason PROJECT_CARD_PROJECTION is: both feed the
// same VideoBlogType, and a field added to one and missed on the other is a card that renders blank
// on one route and not the other.
const VIDEO_BLOG_CARD_PROJECTION = `{
	"slug": slug.current,
	title,
	img,
	_createdAt,
	mediaUrl,
	description
}`

// Newest first, matching the studio's createdAtDesc ordering — which is a sort option for editors and
// does nothing to a query, so it has to be restated here.
//
// _id breaks ties, and that is what makes paging *correct* rather than merely consistent. The project
// ordering above gets a total sort for free, because the titles it sorts on are unique codes;
// _createdAt carries no such guarantee. Two blogs published in the same instant — a scripted import,
// a bulk publish — are tied, and a tie is free to come back in either order on either request, so one
// blog could sit on page one for the count request and page two for the slice request: shown twice,
// or not at all. _id is unique by definition, so appending it leaves no tie for the sort to be
// arbitrary about.
//
// Shared for the same reason the projection is: page one of /diary and the home teaser are the same
// blogs in the same order, and two orderings that drifted apart would quietly disagree about which.
const VIDEO_BLOGS_ORDER = `order(_createdAt desc, _id desc)`

// Every video blog the home teaser needs, up to a limit the caller sets.
const VIDEO_BLOGS_QUERY =
	`*[_type == "videoBlog"] | ${VIDEO_BLOGS_ORDER}[0...$limit]${VIDEO_BLOG_CARD_PROJECTION}`

// One page of the same. No filter to take here, unlike the projects page query — a videoBlog
// references nothing, so a page number is the whole of that route's state.
const VIDEO_BLOGS_PAGE_QUERY =
	`*[_type == "videoBlog"] | ${VIDEO_BLOGS_ORDER}[$start...$end]${VIDEO_BLOG_CARD_PROJECTION}`

// Every video blog in the studio, counted server-side for the same reason the project count is: the
// callers wanting the number are showing a limited slice of it.
const VIDEO_BLOGS_COUNT_QUERY = `count(*[_type == "videoBlog"])`

export async function getVideoBlogs(limit: number): Promise<VideoBlogType[]> {
	return await sanityClient.fetch<VideoBlogType[]>(VIDEO_BLOGS_QUERY, { limit })
}

// One page of the same. start/end are the slice bounds rather than a page number, as in
// getProjectsPage: the arithmetic that turns a page into an offset belongs to the caller showing the
// pages, and this stays a plain range.
export async function getVideoBlogsPage(
	{ start, end }:
	{ start: number, end: number }
): Promise<VideoBlogType[]> {
	return await sanityClient.fetch<VideoBlogType[]>(VIDEO_BLOGS_PAGE_QUERY, { start, end })
}

export async function getVideoBlogsCount(): Promise<number> {
	return await sanityClient.fetch<number>(VIDEO_BLOGS_COUNT_QUERY)
}

// Every testimonial in the studio, for the callers that show them on their own rather than through
// the project that references one.
//
// _id, because a testimonial carries no slug and a list of them still needs a key. It is a system
// field, so it comes back only when the projection names it, the same way _createdAt does for blogs.
//
// The quote, its attribution and the key. No image field: the schema has none — see SCHEMA.md, where
// attribution is text only. No card/show split and no second projection either, because there is no
// fuller view of a testimonial to hold anything back for.
const TESTIMONIAL_PROJECTION = `{
	_id,
	testimonial,
	author,
	authorDetail
}`

// Newest first, and _id breaks ties for the reason the blog ordering carries one: nothing about
// _createdAt is unique, so two testimonials saved in the same instant are free to come back in either
// order on either request. There is no paging here for that to corrupt — this query has no count to
// disagree with — but a section that shuffles itself on a refresh, for no reason a reader can see, is
// its own kind of wrong.
//
// The slice bound is a parameter, as in the projects and video blogs queries above, so one query
// serves a three-quote teaser and a page of every quote there is.
const TESTIMONIALS_QUERY =
	`*[_type == "testimonial"] | order(_createdAt desc, _id desc)[0...$limit]${TESTIMONIAL_PROJECTION}`

// A filter always projects to an array, so a studio with no testimonials comes back as [] rather than
// null and the caller decides what an empty section looks like by measuring it.
export async function getTestimonials(limit: number): Promise<TestimonialType[]> {
	return await sanityClient.fetch<TestimonialType[]>(TESTIMONIALS_QUERY, { limit })
}
