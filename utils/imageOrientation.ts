import { type SanityImageSource } from "@sanity/image-url"

// Which way round a picture stands, read straight off the asset it points at.
//
// Sanity writes a file's pixel size into the asset's own id — image-<hash>-2000x3000-jpg — and into
// the file name of every URL built from that id, so the size is already in hand wherever an image
// source is. No second query, no image document to resolve, and nothing to await: a layout that has
// to know a picture's proportions before it can size the box around it can ask on the server, while
// it is building that box.
//
// What it reads is the FILE's size, not the editor's crop. A landscape original cropped down to a
// standing rectangle still answers landscape here. Reading the crop instead would mean multiplying
// the rect's fractions back out, which is worth doing the day an editor's crop actually fights the
// box it lands in — for now the two agree.
const DIMENSIONS = /-(\d+)x(\d+)[-.]/

// SanityImageSource is five shapes, and the id is in a different place in each: the string itself, a
// reference, a resolved asset document, an image object pointing at either of those, or a stub
// carrying nothing but a URL. The recursion is the image-object case — its asset is itself one of
// the other four.
//
// "" for anything unrecognised, which the caller reads as "no size here" like any other miss.
function assetIdentifier(source: SanityImageSource): string {
	if (typeof source === "string") return source

	if ("asset" in source && source.asset) return assetIdentifier(source.asset)

	const { _ref, _id, url } = source as { _ref?: string, _id?: string, url?: string }

	return _ref ?? _id ?? url ?? ""
}

export type Orientation = "portrait" | "landscape"

// Landscape is the answer for a square picture and for one whose size cannot be read at all — a
// caller picking a ratio off this gets the wider of the two either way, which crops a square in from
// its sides rather than leaving a standing box half empty.
export default function imageOrientation(source: SanityImageSource): Orientation {
	const dimensions = DIMENSIONS.exec(assetIdentifier(source))

	if (!dimensions) return "landscape"

	const [, width, height] = dimensions

	return Number(height) > Number(width) ? "portrait" : "landscape"
}
