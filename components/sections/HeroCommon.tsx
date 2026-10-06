import ImageParallax from "@/components/animation/ImageParallax"
import TextLineSplit from "@/components/animation/TextLineSplit"
import Section from "@/components/layout/Section"
import Image from "@/components/media/Image"
import ImageDimmer from "@/components/media/ImageDimmer"
import buildImageUrl, { HERO } from "@/utils/buildImageUrl"
import { type Image as ImageType } from "@/types/CommonTypes"

// Full-screen dark band with a heading and subheading, drawn over an optional picture
export default function HeroCommon(
	{ heading, subheading, img }: { heading: string, subheading: string, img?: ImageType | null }) {
	return (
		<Section className="
			relative min-h-screen w-full py-size-24 overflow-hidden
			bg-foreground text-background selection-invert
		">
			{
				img &&
				<>
					<ImageParallax>
						<Image
							src={buildImageUrl(img.src, HERO)}
							alt={img.alt ?? ""}
							fill
							sizes="100vw"
							quality={99}
							loading="eager"
							className="object-cover" />
					</ImageParallax>
					<ImageDimmer />
				</>
			}
			{/* relative, so the text paints over the positioned picture layers */}
			<TextLineSplit
				as="h1"
				className="text-size-72 row-start-1 col-span-full lg:col-span-6 self-center relative">
				{heading}
			</TextLineSplit>
			<TextLineSplit
				as="h2"
				className="
					text-size-24 self-center relative
					col-start-7 col-span-6
					sm:col-span-5
					md:col-span-4
					lg:col-span-3
					2xl:col-span-2
				">
				{subheading}
			</TextLineSplit>
		</Section>
	)
}
