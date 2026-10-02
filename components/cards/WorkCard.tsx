
import { type WorkNarrow } from "@/types/WorkTypes"
import Link from "next/link"
import Image from "@/components/media/Image"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import ScrollReveal from "@/components/animation/ScrollReveal"

// index is the card's place in its row, handed down by the grid — it is the grid that knows how
// many columns it has. See ScrollReveal for what it is used for.
export default function WorkCard(
	{ work, index = 0 }:
		{ work: WorkNarrow; index?: number }) {
	const { title, img, slug } = work

	return (
		<div className="col-span-1 relative group">
			<PointerOverlayTrigger />
			<ScrollReveal index={index} />
			<Link className="absolute inset-0 z-1" href={`/work/${slug}`} />
			<div className="bg-image-placeholder aspect-4/3 relative overflow-hidden">
				{
					img &&
					<div className="absolute inset-0 scale-105 group-hover:scale-100 transition-[scale] duration-300 ease-out">
						{/* fill, because next/image refuses a remote picture with no size, and the card's
						    box — its aspect, not the file — is what decides the size here. sizes is
						    the widest a card gets: half of ten columns on a desktop. */}
						<Image
							src={buildImageUrl(img.src, CARD)}
							alt={title}
							fill
							sizes="(min-width: 64rem) 45vw, 100vw"
							quality={99}
							className="object-cover" />
					</div>
				}
			</div>
			<div className="flex flex-col gap-1.5 md:flex-row md:gap-size-48 mt-size-16 justify-between md:items-center">
				<h3 className="text-size-16 group-hover:underline col-span-2">{title}</h3>
			</div>

		</div>
	)
}
