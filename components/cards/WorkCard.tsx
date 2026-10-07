import Link from "@/components/navigation/LocaleLink"
import ScrollReveal from "@/components/animation/ScrollReveal"
import Image from "@/components/media/Image"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import { type WorkNarrow } from "@/types/WorkTypes"

// delay staggers the reveal (desktop only)
export default function WorkCard({ work, delay }: { work: WorkNarrow, delay?: number }) {
	const { title, img, slug } = work

	return (
		<div className="col-span-1 relative group">
			<PointerOverlayTrigger />
			<ScrollReveal delay={delay} />
			<Link className="absolute inset-0 z-1" href={`/work/${slug}`} />
			<div className="bg-image-placeholder aspect-4/3 relative overflow-hidden">
				<div className="
					absolute inset-0 scale-105
					group-hover:scale-100
					transition-[scale] duration-300 ease-out
				">
					<Image
						src={buildImageUrl(img.src, CARD)}
						alt={img.alt ?? title}
						fill
						sizes="(min-width: 64rem) 45vw, 100vw"
						quality={99}
						className="object-cover" />
				</div>
			</div>
			<h3 className="mt-size-16 text-size-16 group-hover:underline">{title}</h3>
		</div>
	)
}
