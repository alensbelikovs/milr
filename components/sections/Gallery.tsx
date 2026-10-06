import Section from "@/components/layout/Section"
import Image from "@/components/media/Image"
import buildImageUrl, { HERO } from "@/utils/buildImageUrl"
import { type WorkGalleryImage } from "@/types/WorkTypes"

// Repeating placement: full-bleed, a stepped pair, full-bleed, a pair stepped the other way.
// Each pair overlaps by a column, which pushes the second picture onto the next row.
const VARIANTS = [
	"col-span-full aspect-4/3",
	"col-span-8 col-start-2 md:col-start-2 md:col-span-6",
	"col-span-8 col-start-4 md:col-start-6 md:col-span-6",
	"col-span-full aspect-4/3",
	"col-span-8 col-start-4 md:col-start-6 md:col-span-6",
	"col-span-8 col-start-2 md:col-start-2 md:col-span-6",
]

// A work's gallery; pictures in the narrow steps take their ratio from the file
export default function Gallery({ images, title }: { images: WorkGalleryImage[], title: string }) {
	if (images.length === 0) return null

	return (
		<Section className="gap-y-size-192">
			{images.map(({ _key, src, alt, aspectRatio }, index) => {
				const variant = VARIANTS[index % VARIANTS.length]
				const narrow = !variant.startsWith("col-span-full")

				return (
					<div
						key={_key}
						className={`
							relative overflow-hidden bg-image-placeholder
							${variant}
							${narrow ? aspectRatio < 1 ? "aspect-3/4" : "aspect-4/3" : ""}
						`}>
						<Image
							src={buildImageUrl(src, HERO)}
							alt={alt ?? title}
							fill
							sizes={narrow ? "42vw" : "100vw"}
							quality={99}
							className="object-cover" />
					</div>
				)
			})}
		</Section>
	)
}
