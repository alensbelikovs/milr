import { type Image, type Solution, type Testimonial, type WorkFilter } from "@/types/CommonTypes"

export type WorkPageParams = {
	sectors?: string | string[],
	solutions?: string | string[],
	featured?: string | string[],
	page?: string | string[]
}

// Fields needed to list a work as a card
export type WorkNarrow = {
	title: string,
	slug: string,
	img: Image
}

export type WorkGalleryImage = Image & {
	_key: string,
	aspectRatio: number
}

// Everything shown on a work's own page
export type WorkBroad = WorkNarrow & {
	_createdAt: string,
	subtitle: string,
	description: string,
	sector: (WorkFilter & { _key: string })[],
	solutions: (Solution & { _key: string })[],
	location: { city: string, country: string } | null,
	area: number | null,
	testimonial: Testimonial | null,
	gallery: WorkGalleryImage[]
}
