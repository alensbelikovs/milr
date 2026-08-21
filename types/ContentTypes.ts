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
