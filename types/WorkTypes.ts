import { type Testimonial, type Image, type WorkFilter, type Solution } from "@/types/CommonTypes"
import { type SanityImageSource } from "@sanity/image-url"

// Different from the general work filter, so made a standalone type
export type WorkLocation = {
	city: string,
	country: string
}

// For working with WorkPage searchParams
export type WorkPageParams = {
	sectors?: string | string[],
	solutions?: string | string[],
	page?: string | string[]
}

// Type for listing works in /work page,
// less fields are populated than show type, so made a standalone type
export interface WorkNarrow {
	title: string,
	slug: string,
	img: Image,
}

// Type for showing details about a project in /work/[workSlug] page
// Requires all properties of WorkNarrow + full reflection of sanity schema
export interface WorkBroad extends WorkNarrow {
	sector?: WorkFilter[],
	solutions?: Solution[],
	location?: WorkLocation,
	area?: number,
	testimonial?: Testimonial,
	gallery?: Image[],
	description: string,
	featured: boolean
}

// A "skill" type. Used for filtering and displaying in Services section.
export type SolutionType = {
	title: string,
	slug: string,
	description: string,
	img: Image
}
