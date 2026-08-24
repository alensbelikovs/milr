import { type SanityImageSource } from "@sanity/image-url"

export type ProjectListType = {
	title: string,
	slug: string,
	img: SanityImageSource,
	// Flattened to the category's title by the query, not the reference itself: nothing on the frontend
	// has a use for a category document.
	//
	// Nullable despite the schema marking the reference required: required only stops the Studio saving
	// a new document without one, so projects written before the field existed still carry no category,
	// and a reference whose target is unpublished or deleted resolves to null too.
	category: string | null
}

// A category as the chips need it: the id to filter on, the title to print, and how many projects
// carry it. The _id is here rather than a slug because the document has no slug field — see
// SCHEMAS.md — so the URL segment is derived from the title by categorySlug and resolved back to
// this id, which is what the query actually filters on.
export type CategoryListType = {
	_id: string,
	title: string,
	count: number
}

export type ProjectShowType = ProjectListType & {
	alt: string | null
	location: string
	year: string | null
	description: string | null
	// testimonial: ProjectTestimonialType | null
}

export type VideoBlogType = {
	title: string,
	slug: string,
	img: SanityImageSource,
	_createdAt: Date,
	mediaUrl: string,
	description: string
}
