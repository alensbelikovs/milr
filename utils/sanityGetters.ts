import { cache } from "react"
import { connection } from "next/server"
import { sanityClient } from "@/utils/sanityClient"
import {
	type ProudestWorkType,
	type TestimonialType,
	type PostType,
	type ServiceType,
	type WorkCategory,
	type WorkListType,
	type WorkShowType,
	type WorkType,
	type GeneralInformationType,
} from "@/types/ContentTypes"

// Cards for a work grid: the bare slug, the title, and the cover as an image source rather than a
// finished URL. Sizing is the call site's business — see buildImageUrl — so the query hands over the
// asset reference and lets a card ask for card dimensions and a hero ask for 2K.
//
// type and category are references, so each needs the -> to resolve, and both are flattened to their
// titles on the way out: the card prints those strings and has no use for the documents behind them.
//
// Shared between the two queries below rather than written twice, because both feed the same
// WorkListType and a field added to one and missed on the other is a card that renders blank on
// one route and not the other.
const WORK_CARD_PROJECTION = `{
	title,
	"slug": slug.current,
	"type": type->title,
	"category": category->title,
	media
}`

// Ordered by title descending because the titles are sequential codes: MR-008 sorts above MR-007, so
// the newest work leads without a second field to keep in step with it.
//
// _id breaks ties, and that is what makes paging *correct* rather than merely consistent. Nothing in
// the schema makes a title unique, and a tie is free to come back in either order on either request —
// so a piece could sit on page one for the count request and page two for the slice request: shown
// twice, or not at all. _id is unique by definition, so appending it leaves no tie to be arbitrary
// about.
const WORK_ORDER = `order(title desc, _id desc)`

// Every piece of work, optionally narrowed to a category and a type, each named by slug.
//
// A null parameter is the unfiltered case rather than a second query: the || short-circuits, and one
// query serves All, either filter alone, and both together. Matching on the slug through the -> costs
// a join per document, and buys a query the page can hand the URL's own words to — no slug-to-_id
// lookup on the way in. The studio holds a handful of documents; the join is not worth a round trip.
const WORK_FILTER = `_type == "work"
	&& ($category == null || category->slug.current == $category)
	&& ($type == null || type->slug.current == $type)`

// Every piece of work but one, as cards — the pool a random selection is drawn from.
//
// GROQ has no random ordering, so the query hands over the whole pool and the draw happens in
// getRandomWork below. Fine at a portfolio's size; the day the studio holds hundreds of pieces, fetch
// only _ids here, draw from those, and fetch the few cards that won.
//
// A null $except is the case with nothing to leave out: slug.current != null holds for every
// published work, since the slug is required, so the filter collapses to the type check and one query
// serves the home page and a work page alike.
const WORK_EXCEPT_QUERY =
	`*[_type == "work" && slug.current != $except]${WORK_CARD_PROJECTION}`

// The filter above, less the piece the proudest-work band features. The band already shows it, so a
// card for it in the grid as well would show one piece twice on the same screen.
//
// Left out on every page, not only the first where the band is. Pulling it from page one alone would
// shift it into page two's slice, and the count and the slices would stop agreeing about what is
// being paged through. It is featured; the band on page one is where it lives.
//
// Nothing featured is the null case, as with the parameters above: the subquery comes back null,
// _id != null holds for every document, and the filter collapses to WORK_FILTER.
const WORK_GRID_FILTER =
	`${WORK_FILTER} && _id != *[_id == "proudestWork"][0].work._ref`

// The whole studio counted, featured piece and all — the heading's number, which is the collection
// rather than whatever the grid happens to be paging through.
const WORK_COUNT_QUERY = `count(*[_type == "work"])`

// Every category some piece of work is filed under, as the filter nav lists them. One with nothing in
// it is dropped: a filter whose only destination is an empty grid is a dead end. Reaching one by URL
// still resolves — the page looks slugs up in this list, so it 404s instead, which is the honest
// answer for a collection with nothing in it.
//
// Counted from the work side because the reference only points one way. The ^ climbs out of the
// subquery to the category being filtered, so each row counts its own.
const WORK_CATEGORIES_QUERY =
	`*[_type == "category" && count(*[_type == "work" && category._ref == ^._id]) > 0]
		| order(title asc){ "name": title, "slug": slug.current }`

// The same for types.
const WORK_TYPES_QUERY =
	`*[_type == "workType" && count(*[_type == "work" && type._ref == ^._id]) > 0]
		| order(title asc){ "name": title, "slug": slug.current }`

// The proudest-work singleton, followed through to the piece it points at. The singleton is pinned
// to the document id proudestWork by the studio's structure, so it is looked up by _id rather than by
// type.
//
// Its work reference is optional — an editor can feature nothing — and a missing singleton, a missing
// reference and a reference to a deleted document all come back null through the ->, which is the
// one empty case callers test for.
//
// A picture and somewhere to go, and nothing else — the band is its cover, and the whole of it is
// one link. The cover is projected the way every other image here is, alt hoisted out beside the
// picture itself.
//
// The filter is the interesting half. The band only belongs on the index while the piece it features
// is part of the set on screen — a Commercial band between two grids of Residential contradicts the
// filter just picked — and the page used to decide that for itself by comparing the slugs of the
// type and category it had fetched. Asking the query instead keeps those two references out of the
// projection entirely: the match is made where the documents already are, and what comes back is
// either the piece or nothing.
//
// The filter follows work-> twice over, which is two joins on one document and cheaper than the two
// fields it replaces. A null parameter is the unfiltered case, as in WORK_FILTER above: the ||
// short-circuits before the join, so one query serves All and either filter alike.
const PROUDEST_WORK_QUERY = `*[_id == "proudestWork"
	&& ($category == null || work->category->slug.current == $category)
	&& ($type == null || work->type->slug.current == $type)
][0].work->{
	"cover": media{ alt, "media": @ },
	"slug": slug.current
}`

// Everything the work index shows under a filter, in one round trip: a page of cards, how many
// cards there are to page through, and the featured piece if it belongs under the filter.
//
// One query rather than three because the grid and the band are two halves of one answer — the grid
// is the filtered set less whatever the band features — and asking once means both halves are read
// off the same state of the studio. Three requests could straddle an editor changing the featured
// piece and come back with it in both places, or in neither.
//
// Counted server-side rather than by measuring the fetched array, because the array is one page of
// it. Same filter as the slice, so the pagination is counting the set it is actually paging through.
const WORK_INDEX_QUERY = `{
	"work": *[${WORK_GRID_FILTER}] | ${WORK_ORDER}[$start...$end]${WORK_CARD_PROJECTION},
	"count": count(*[${WORK_GRID_FILTER}]),
	"proudestWork": ${PROUDEST_WORK_QUERY}
}`

// One piece of work by slug, with everything its page shows.
//
// The lead image comes back as cover, projected the same way a gallery item is — alt hoisted out
// beside the picture, "media": @ handing over the object itself so hotspot and crop survive for
// buildImageUrl. Same shape as the gallery's images and as the site-wide cover, which is what lets
// one hero prop take any of the three. Required in the schema, so it is never null.
//
// type and category resolve to name and slug, the same shape the proudest-work query hands over, so
// the page can print the name and link to the filter by slug.
//
// gallery is inline on the document — no -> needed — and comes back in the order the editor arranged
// it. Each item is projected rather than taken bare so _key comes out beside it, which is the only
// stable React key a reorderable list has. "media": @ hands over the item itself, hotspot and crop
// included, which is what makes it an image source buildImageUrl can size; alt is hoisted out beside
// it so the page does not reach into the image for its text. The schema requires a non-empty gallery,
// and coalesce covers the draft that slipped through anyway: [] rather than null, so .map never
// crashes on it.
//
// location and area are taken as they are: an unset location is null, and so is an unset area, which
// is the whole of the empty case the detail table tests for. location is an inline object, so it
// needs no -> and comes back whole.
//
// services are references, projected with their _key and dereferenced in the same step — the key is
// the array item's identity and does not survive the ->. The description and the picture come with
// the title because pressing one in the table opens it in the sidebar, which shows all three.
// coalesce, so an unset array is [] rather than null and the caller measures it instead of guarding
// it.
//
// testimonial is an optional reference and projects to null on a work without one — the page tests
// for that null to decide whether the section shows. Its quote is renamed to text to match
// TestimonialType.
const WORK_ITEM_QUERY = `*[_type == "work" && slug.current == $slug][0]{
	title,
	"summary": shortDescription,
	"cover": media{ alt, "media": @ },
	"type": type->{ "name": title, "slug": slug.current },
	"category": category->{ "name": title, "slug": slug.current },
	location,
	area,
	"services": coalesce(services, [])[]{
		_key,
		"title": @->title,
		"description": @->description,
		"media": @->media
	},
	_createdAt,
	description,
	"gallery": coalesce(gallery, [])[]{
		_key,
		alt,
		"media": @
	},
	testimonial->{
		"text": testimonial,
		author,
		description
	}
}`

// limit pieces drawn at random, leaving out one by slug. Fewer when the pool is smaller, and [] from an
// empty studio, so callers decide what "no work" looks like by measuring it.
//
// connection() first, so the draw happens per request. Without it a page with nothing else dynamic on
// it — the home page — is prerendered at build, and the "random" pick would be the same four until the
// next deploy.
//
// Drawn on the server, not in the browser: the HTML and the hydrated page have to agree, and a draw on
// each side would pick two different sets.
export async function getRandomWork(
	{ limit, except = null }:
	{ limit: number, except?: string | null }
): Promise<WorkListType[]> {
	await connection()
	const pool = await sanityClient.fetch<WorkListType[]>(WORK_EXCEPT_QUERY, { except })

	// Fisher–Yates, stopped once the first limit slots are settled: each is swapped with a uniformly
	// chosen piece from the rest, so every set of limit pieces is equally likely and nothing past the
	// slice is shuffled for nothing.
	const count = Math.min(limit, pool.length)
	for (let i = 0; i < count; i++) {
		const j = i + Math.floor(Math.random() * (pool.length - i))
		;[pool[i], pool[j]] = [pool[j], pool[i]]
	}

	return pool.slice(0, count)
}

// category and type are slugs, and null means "any".
export type WorkFilter = { category: string | null, type: string | null }

// A page of the index, narrowed by the filter. start/end are the slice bounds rather than a page
// number: the arithmetic that turns a page into an offset belongs to the caller showing the pages,
// and this stays a plain range.
//
// proudestWork is null when nothing is featured, and null just as readily when what is featured falls
// outside the filter — one empty case for both, because the caller does the same thing in either: it
// leaves the band out. It comes back on every page; which pages show the band is the caller's call.
export async function getWorkIndex(
	{ category, type, start, end }:
	WorkFilter & { start: number, end: number }
): Promise<{ work: WorkListType[], count: number, proudestWork: ProudestWorkType | null }> {
	return await sanityClient.fetch(WORK_INDEX_QUERY, { category, type, start, end })
}

export async function getWorkCount(): Promise<number> {
	return await sanityClient.fetch<number>(WORK_COUNT_QUERY)
}

export async function getWorkCategories(): Promise<WorkCategory[]> {
	return await sanityClient.fetch<WorkCategory[]>(WORK_CATEGORIES_QUERY)
}

export async function getWorkTypes(): Promise<WorkType[]> {
	return await sanityClient.fetch<WorkType[]>(WORK_TYPES_QUERY)
}

// Null when the slug matches nothing — [0] over an empty result set is null — which is the signal
// callers turn into a 404.
export async function getWorkBySlug(slug: string): Promise<WorkShowType | null> {
	return await sanityClient.fetch<WorkShowType | null>(WORK_ITEM_QUERY, { slug })
}

// Everything a post needs, wherever it appears. A post is a link-out card — no slug and no page of
// its own — so there is no second, fuller query behind this one: the grid holds everything the
// sidebar panel shows when one is opened.
//
// url is renamed to externalUrl on the way out. The schema calls the field url; the frontend has
// always called it externalUrl, and renaming here rather than in the components keeps one name in
// the markup and leaves PostType untouched.
//
// The cover stays an image source, as in the work cards above, so sizing stays the call site's
// decision.
//
// _createdAt is asked for by name: it is a system field, so it comes back only when the projection
// says so, and the ordering and the date on the card are both read off it.
//
// Shared between the queries below, because both feed the same PostType and a field added to one and
// missed on the other is a card that renders blank on one route and not the other.
const POST_PROJECTION = `{
	title,
	"externalUrl": url,
	media,
	_createdAt
}`

// Newest first, matching the studio's own ordering — which is a sort option for editors and does
// nothing to a query, so it has to be restated here.
//
// _id breaks ties, and that is what makes paging *correct* rather than merely consistent. The work
// ordering above gets a total sort for free, because the titles it sorts on are unique codes;
// _createdAt carries no such guarantee. Two posts published in the same instant — a scripted import,
// a bulk publish — are tied, and a tie is free to come back in either order on either request, so one
// post could sit on page one for the count request and page two for the slice request: shown twice,
// or not at all. _id is unique by definition, so appending it leaves no tie to be arbitrary about.
const POSTS_ORDER = `order(_createdAt desc, _id desc)`

const POSTS_QUERY =
	`*[_type == "post"] | ${POSTS_ORDER}[0...$limit]${POST_PROJECTION}`

// One page of the same. No filter to take here, unlike the work page query — a post references
// nothing, so a page number is the whole of that route's state.
const POSTS_PAGE_QUERY =
	`*[_type == "post"] | ${POSTS_ORDER}[$start...$end]${POST_PROJECTION}`

// Counted server-side for the same reason the work count is: the callers wanting the number are
// showing a limited slice of it.
const POSTS_COUNT_QUERY = `count(*[_type == "post"])`

// A filter always projects to an array, so a studio with no posts comes back as [] rather than null
// and the caller decides what an empty section looks like by measuring it.
export async function getPosts(limit: number): Promise<PostType[]> {
	return await sanityClient.fetch<PostType[]>(POSTS_QUERY, { limit })
}

// start/end are the slice bounds rather than a page number, as in getWorkPage: the arithmetic that
// turns a page into an offset belongs to the caller showing the pages, and this stays a plain range.
export async function getPostsPage(
	{ start, end }:
	{ start: number, end: number }
): Promise<PostType[]> {
	return await sanityClient.fetch<PostType[]>(POSTS_PAGE_QUERY, { start, end })
}

export async function getPostsCount(): Promise<number> {
	return await sanityClient.fetch<number>(POSTS_COUNT_QUERY)
}

// Every service the studio offers, which is one list serving two jobs — see SCHEMA.md, where a
// service carries its own picture and description precisely so the site-wide Services section can be
// built from the same documents the work detail table references.
//
// ServiceType is that shape already: title, description and the picture the panel beside the list
// shows. No slug to project, because a service has no page of its own — pressing one opens the
// sidebar.
//
// Alphabetical, because the schema gives a service nothing else to sort on and an unordered list
// would come back in a different order per request for no reason a reader could see.
const SERVICES_QUERY = `*[_type == "service"] | order(title asc, _id asc){
	title,
	description,
	media
}`

export async function getServices(): Promise<ServiceType[]> {
	return await sanityClient.fetch<ServiceType[]>(SERVICES_QUERY)
}

// Every testimonial in the studio, as the pool one is drawn from.
//
// The quote and the two halves of its attribution, and nothing else. No image field: the schema has
// none — see SCHEMA.md, where attribution is text only. No card/show split and no second projection
// either, because there is no fuller view of a testimonial to hold anything back for. The quote is
// renamed to text to match TestimonialType, the same way the work query does it.
const TESTIMONIAL_PROJECTION = `{
	"text": testimonial,
	author,
	description
}`

// Unordered, which is the one query here that wants to be. Everything else in this file sorts and
// breaks ties on _id precisely so two requests cannot disagree about what comes back — but the draw
// below is going to ignore the order anyway, and asking the server to sort a pool nobody reads in
// order is work for nothing.
const TESTIMONIALS_POOL_QUERY = `*[_type == "testimonial"]${TESTIMONIAL_PROJECTION}`

// One testimonial, drawn at random per request.
//
// connection() first, for the reason getRandomWork carries it: without it a page with nothing else
// dynamic on it is prerendered at build, and the "random" quote would be the same one on every visit
// until the next deploy.
//
// Drawn on the server rather than in the browser, again as above: the HTML and the hydrated page
// have to agree, and a draw on each side would pick two different quotes.
//
// The whole pool comes back to pick one from, which GROQ leaves no way around — it has no random
// ordering — and which costs nothing at the handful of quotes a studio like this holds. The day
// there are hundreds, fetch _ids here, draw from those, and fetch the one that won.
//
// Null from an empty studio, which is the one empty case the caller tests for. A filter always
// projects to an array, so that case arrives as [] rather than as null from the query itself.
export async function getRandomTestimonial(): Promise<TestimonialType | null> {
	await connection()
	const pool = await sanityClient.fetch<TestimonialType[]>(TESTIMONIALS_POOL_QUERY)

	if (pool.length === 0) return null

	return pool[Math.floor(Math.random() * pool.length)]
}

// The site-wide singleton, looked up by _id rather than by type — the id is fixed to the type name
// by the Studio's structure, and a direct id lookup is cheaper than a scan.
//
// The whole of it, now that the detail lists in the footer and the sidebar menu print the contact
// half and the hero is drawn over the cover. hours and address are inline objects, so they need no
// -> and come back whole; socials is an object array, projected with _key rather than taken bare
// because the key is the array item's identity and the only stable React key the list has — the
// same reason gallery and services are projected that way above.
const GENERAL_INFORMATION_QUERY = `*[_id == "generalInformation"][0]{
	"cover": cover{ alt, "media": @ },
	email,
	phone,
	socials[]{ _key, title, url },
	hours,
	address
}`

// How long a copy of the singleton stays good for. An hour, because this is an address and a phone
// number: it changes when the studio moves, which is not something anyone is waiting on a reload
// for. What the number actually buys is the ROOT LAYOUT — this is awaited there now, and an uncached
// fetch in a layout is one every route in the site blocks on. Cached, it is one round trip an hour
// shared by every request and every visitor, and the layout stays prerenderable.
const GENERAL_INFORMATION_REVALIDATE = 3600

// Null when the singleton has never been saved — [0] over an empty result set — which is the one
// empty case callers test for. Every field on a saved one is required, so there are no half-empty
// singletons to guard against past that.
//
// cache() because this is asked for twice in one render now: the root layout wants the contact
// details for the footer and the sidebar, and the home page wants the cover for its hero. They are
// in the same render pass, so the second call is served from the first rather than costing a second
// round trip. The revalidate above is what dedupes ACROSS requests; this is what dedupes within one.
export const getGeneralInformation = cache(
	async (): Promise<GeneralInformationType | null> =>
		await sanityClient.fetch<GeneralInformationType | null>(
			GENERAL_INFORMATION_QUERY,
			{},
			{ next: { revalidate: GENERAL_INFORMATION_REVALIDATE } })
)
