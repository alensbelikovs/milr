import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url"
import { sanityClient } from "@/utils/sanityClient"

const builder = createImageUrlBuilder(sanityClient)

// Full-bleed hero covers. The canvas draws these across the whole viewport, so they are requested at
// 2K and scaled down from there rather than up.
export const HERO = { width: 2048 }

// Grid cards. The widest a card gets is roughly two thirds of a desktop viewport, so this leaves
// next/image room to pick a 2x variant without pulling the full-size original through it.
export const CARD = { width: 2048 }

export default function buildImageUrl(source: SanityImageSource, { width, quality = 99 }: { width: number, quality?: number }) {
    return builder
        .image(source)
        .width(width)
        .auto("format")
        .quality(quality)
        .url()
}
