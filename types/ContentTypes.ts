// import { type SanityImageSource } from "@sanity/image-url"

// export type ProjectListType = {
// 	title: string,
// 	slug: string,
// 	img: SanityImageSource,
// 	// Flattened to the category's title by the query, not the reference itself: nothing on the frontend
// 	// has a use for a category document.
// 	//
// 	// Nullable despite the schema marking the reference required: required only stops the Studio saving
// 	// a new document without one, so projects written before the field existed still carry no category,
// 	// and a reference whose target is unpublished or deleted resolves to null too.
// 	category: string | null
// }

// // A category as the chips need it: the id to filter on, the title to print, and how many projects
// // carry it. The _id is here rather than a slug because the document has no slug field — see
// // SCHEMAS.md — so the URL segment is derived from the title by categorySlug and resolved back to
// // this id, which is what the query actually filters on.
// export type CategoryListType = {
// 	_id: string,
// 	title: string,
// 	count: number
// }

// // A testimonial. One type, whether it arrives on its own or expanded from the reference a project
// // carries — it is the same document either way, and two types for one document is two things to keep
// // in step for no gain. Both queries project the same four fields so this stays true.
// //
// // _id because a testimonial carries no slug — see SCHEMA.md — so it is the only thing unique about
// // one, and the only thing a React key may be in a list of them. It is a system field, so it comes
// // back only when a projection asks for it by name.
// //
// // The quote keeps the name the schema gives it, awkward as project.testimonial.testimonial reads, so
// // this mirrors the document with no rename to remember in either direction.
// //
// // Attribution is text and only text — see SCHEMA.md, where the author image was dropped.
// //
// // Both nullable, for the reason ProjectListType.category is: required only stops the Studio SAVING a
// // new document without one, and every testimonial written before the field existed still carries
// // null. That is not hypothetical here — the quotes currently in the studio predate both of these and
// // answer null to both, so a caller that trusted required would print a dash with nobody after it.
// //
// // authorDetail is the job title or two-word description beside the name, and is optional in the
// // schema as well.
// export type TestimonialType = {
// 	_id: string,
// 	testimonial: string,
// 	author: string | null,
// 	authorDetail: string | null
// }

// // One image from a project's gallery. Inline on the project document rather than a reference — see
// // SCHEMA.md — so it arrives with no expansion, in the order the editor arranged it.
// //
// // _key is Sanity's own identity for an array item, and the only stable key a gallery has. It is what
// // belongs in the React key: an index would be reused by whichever picture moved into that slot when
// // the array is reordered in the Studio, and SCHEMA.md notes index keys break Visual Editing overlays.
// //
// // No alt, because a gallery item has none to carry — see SCHEMA.md. The cover keeps one, since a
// // project page describes it, but these are decorative and belong to the reader as pictures rather
// // than as content: render them alt="" so a screen reader passes over them instead of reading out an
// // asset name.
// //
// // img stays an image source rather than a finished URL, as everywhere else here — the gallery has no
// // say in how large the picture it hands over is asked for.
// export type ProjectGalleryImageType = {
// 	_key: string,
// 	img: SanityImageSource
// }

// export type ProjectShowType = ProjectListType & {
// 	alt: string | null
// 	location: string
// 	year: string | null
// 	description: string | null
// 	// [] on a project with no gallery rather than null, so callers map over it without testing it
// 	// first — the query coalesces a missing field to an empty array on the way out.
// 	gallery: ProjectGalleryImageType[]
// 	// Null on a project with no testimonial attached — the reference is optional, so the expansion
// 	// yields null rather than an object with empty fields.
// 	testimonial: TestimonialType | null
// }

// export type VideoBlogType = {
// 	title: string,
// 	slug: string,
// 	img: SanityImageSource,
// 	_createdAt: Date,
// 	mediaUrl: string,
// 	description: string
// }
//

// Items returned from sanity to be listed as projects. Only populated fields are included.
export type ProjectListType = {
	title: string,
	slug: string,
	mediaUrl: string | null,
}

// Items returned from sanity to be listed as diary entries. Only populated fields are included.
export type DiaryListType = {
	title: string,
	slug: string,
	_createdAt: Date,
	mediaUrl: string | null,
}
