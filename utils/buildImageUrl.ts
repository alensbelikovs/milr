import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url"
import { sanityClient } from "@/utils/sanityClient"

const builder = createImageUrlBuilder(sanityClient)

export const HERO = { width: 2048 }
export const CARD = { width: 2048 }

export default function buildImageUrl(source: SanityImageSource, { width }: { width: number }) {
	return builder
		.image(source)
		.width(width)
		.auto("format")
		.quality(99)
		.url()
}
