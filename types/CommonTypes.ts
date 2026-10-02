import { SanityImageSource } from "@sanity/image-url"

export type Testimonial = {
	text: string,
	author: string,
	description: string
}

export type Solution = {
	title: string,
	description: string,
	slug: string,
	img: Image
}

export type Image = {
	src: SanityImageSource,
	alt?: string | null
}

// A general type for descriptive things such as category, project type, location, etc.
export type WorkFilter = {
	title: string,
	slug: string
}

export type SocialLink = {
	title: string,
	url: string
}
export type Address = {
	streetName: string,
	streetNumber: string,
	postalCode: string,
	city: string,
	country: string
}
export type OpeningHours = {
	workFromDay: string,
	workToDay: string,
	workHourFrom: string,
	workHourTo: string
}
export type GeneralInformation = {
	img: Image,
	email: string,
	phone: string,
	socials: SocialLink[],
	hours: OpeningHours,
	address: Address
}
