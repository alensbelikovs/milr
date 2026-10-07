import { type SanityImageSource } from "@sanity/image-url"
import { type PortableTextBlock } from "@portabletext/react"

export type Image = {
	src: SanityImageSource,
	alt?: string | null
}

// A title + slug pair, used for sectors and solution filters
export type WorkFilter = {
	title: string,
	slug: string
}

export type Solution = {
	title: string,
	slug: string,
	description: string,
	img: Image | null
}

export type Testimonial = {
	text: string,
	author: string,
	description: string
}

export type Post = {
	_id: string,
	_createdAt: string,
	title: string,
	description: string,
	url: string,
	img: Image | null
}

export type SocialLink = {
	_key: string,
	title: string,
	url: string
}

// Days are lowercase slugs (monday … sunday), hours are zero-padded HH:MM
export type OpeningHours = {
	workFromDay: string,
	workToDay: string,
	workHourFrom: string,
	workHourTo: string
}

export type Address = {
	streetName: string,
	streetNumber: string,
	postalCode: string,
	city: string,
	country: string
}

export type GeneralInformation = {
	img: Image | null,
	email: string,
	phone: string,
	socials: SocialLink[],
	hours: OpeningHours,
	address: Address
}

// Dates are YYYY-MM-DD; body is paragraphs, h5 headings and links
export type CookiesPrivacy = {
	effectiveDate: string,
	updatedDate: string | null,
	body: PortableTextBlock[] | null
}
