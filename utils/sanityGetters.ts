import { sanityClient } from "@/utils/sanityClient"
import { ProjectListType, ProjectShowType, VideoBlogType } from "@/types/ContentTypes"

// Cards for a project grid: the bare slug, the title, and the cover as an image source rather than a
// finished URL. Sizing is the call site's business — see buildImageUrl — so the query hands over the
// asset reference and lets a card ask for card dimensions and a hero ask for 2K.
//
// Ordered by title descending because the titles are sequential codes: MR-008 sorts above MR-007, so
// the newest work leads without a second field to keep in step with it.
//
// The slice bound is a parameter, so this one query serves whatever limit a caller asks for.
//
// category is a reference, so it needs the -> to resolve, and it is flattened to the title on the way
// out: the card prints that string and has no use for the document behind it.
const PROJECTS_QUERY = `*[_type == "project"] | order(title desc)[0...$limit]{
	"slug": slug.current,
	title,
	img,
	"category": category->title
}`

// Every project in the studio, counted server-side rather than by measuring a fetched array: the
// callers that want this number are the ones showing a limited slice of it.
const PROJECTS_COUNT_QUERY = `count(*[_type == "project"])`

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

export async function getProjectsCount(): Promise<number> {
	return await sanityClient.fetch<number>(PROJECTS_COUNT_QUERY)
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
