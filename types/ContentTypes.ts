import { type SanityImageSource } from "@sanity/image-url"

// Items returned from sanity to be listed as projects. Only populated fields are included.
export type ProjectListType = {
	title: string,
	slug: string,
	type: string,
	category: string,
	media: SanityImageSource | null
}

export type ProjectShowType = {
	title: string,
	slug: string,
	media: SanityImageSource | null,
	// Add gallery here
	testimonial: TestimonialType | null
}

// Testimonials are attached to projects and can be retrieved independently.
export type TestimonialType = {
	text: string,
	author: string
}

// Items returned from sanity to be listed as posts. Only populated fields are included.
export type PostType = {
	title: string,
	_createdAt: Date,
	media: SanityImageSource | null,
	externalUrl: string,
}
