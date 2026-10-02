import { type SanityImageSource } from "@sanity/image-url"

// Items returned from sanity to be listed as work. Only populated fields are included.
export type WorkListType = {
	title: string,
	slug: string,
	type: string,
	category: string,
	media: SanityImageSource
}

export type WorkFilter = {
	title: string,
	slug: string
}

// A picture and the words that stand in for it: the pair every image in the studio is fetched as.
// The schema gives every image the same shape — one shared media object, with alt optional on all of
// them — so alt is null wherever the editor left it blank, on a required picture as much as on any
// other. Named once here because the gallery, a work's lead image and the site-wide cover are all
// this and nothing more.
export type CoverType = {
	alt: string | null,
	media: SanityImageSource
}

// One picture in a work's gallery: a cover plus _key, Sanity's own identity for an array item and
// the only stable React key a reorderable list has.
export type WorkGalleryImageType = CoverType & { _key: string }

// Where a work was built. An inline object in the schema rather than a reference, and every part of
// it optional: an editor who fills in neither half leaves the whole object unset, so the object
// itself is nullable as well as its halves.
export type WorkLocationType = {
	city: string | null,
	country: string | null
}

// One service a work was delivered under. A reference in the schema, resolved to the whole document
// on the way out: the table prints the title, and pressing it opens the same panel the services list
// opens, which needs the description and the picture too. ServiceType is that panel's shape, so this is
// it plus the array item's own _key — the only stable React key a reorderable list has, and something
// the -> does not carry across.
export type WorkServiceType = ServiceType & { _key: string }

// Everything a work's own page shows, its lead image included — the hero band is drawn over it.
//
// location, area and services are all optional in the schema, so each arrives empty on a work whose
// editor has not filled it in — and the detail table leaves out the row rather than printing a blank
// one. services is an array either way: an unset one comes back as [].
export type WorkShowType = {
	title: string,
	cover: CoverType,
	summary: string,
	type: WorkType,
	category: WorkCategory,
	location: WorkLocationType | null,
	area: number | null,
	services: WorkServiceType[],
	_createdAt: Date,
	testimonial: TestimonialType | null,
	gallery: WorkGalleryImageType[],
	description: string[]
}

// Testimonials are attached to work and can be retrieved independently.
//
// author and description are the two halves of one attribution line — "Kārlis and Marta, reflecting
// on their home redesign" — kept apart so each can be set on its own.
export type TestimonialType = {
	text: string,
	author: string,
	description: string
}

// Items returned from sanity to be listed as posts. Only populated fields are included.
export type PostType = {
	title: string,
	_createdAt: Date,
	media: SanityImageSource | null,
	externalUrl: string,
}
// A service the studio offers, as the Services section lists it.
//
// media fills the panel beside the list while the service is hovered. Nullable because a service is
// listed whether or not it has a picture — one without simply shows nothing in the panel.
export type ServiceType = {
	title: string,
	description: string,
	media: SanityImageSource | null
}

// One entry in the singleton's socials list. _key is the array item's identity — socials is an
// object array, so the key is assigned by Sanity and is the only stable React key a reorderable list
// has.
export type SocialLinkType = {
	_key: string,
	title: string,
	url: string
}

// When the studio is open. Days are the lowercase slugs the schema stores — monday … sunday — never
// the labels the Studio shows, so whatever prints them maps them itself. The times are zero-padded
// HH:MM, which sort and compare correctly as plain strings and need no date parsing on either side.
export type OpeningHoursType = {
	workFromDay: string,
	workToDay: string,
	workHourFrom: string,
	workHourTo: string
}

// streetNumber is text rather than a number, because "12A" and "5-7" are both addresses.
export type AddressType = {
	streetName: string,
	streetNumber: string,
	postalCode: string,
	city: string,
	country: string
}

// The site-wide singleton: the cover the home page's hero is drawn over, and everything the detail
// lists in the footer and the sidebar menu print. Every field is required in the schema, so none of
// them is optional here — it is the singleton ITSELF that is nullable, until someone saves it for
// the first time, and that is the one empty case callers test for.
export type GeneralInformationType = {
	cover: CoverType,
	email: string,
	phone: string,
	socials: SocialLinkType[],
	hours: OpeningHoursType,
	address: AddressType
}

export type ImageType = {
	src: SanityImageSource,
	alt?: string
}
