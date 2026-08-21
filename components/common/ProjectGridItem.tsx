import Image from "next/image"
import Link from "next/link"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import ScrollReveal from "@/components/common/ScrollReveal"
import type { ProjectListType } from "@/types/ContentTypes"

// Both halves of the caption underline with the card rather than with themselves. The pointer is
// only ever over one of them, so a hover: variant would underline that one and leave its neighbour
// bare — the card is one link, and its caption reads as one line.
const CAPTION_UNDERLINE =
	"group-hover:underline group-hover:underline-offset-4 " +
	"group-focus-visible:underline group-focus-visible:underline-offset-4"

// Two boxes, because a variant needs to say two things. The outer box is the grid item, so it
// carries the placement, and the link is the card the variant's *: classes reach — which is what
// lets a variant span the whole row for itself and still put its card on columns 9-15.
//
// That outer box is ScrollReveal, which adds nothing to the depth: the variant still lands one level
// above the link, so *:aspect-* keeps reaching the card. Nothing may be inserted between the two —
// a wrapper in there would take the aspect for itself and collapse the cover, whose height comes from
// h-full resolving against the link.
//
// The aspect lands on the link, so it measures the cover alone and the caption rides below it.
// That keeps every cover at the ratio its variant names whatever the caption wraps to, at the cost
// of the caption sitting outside the box the row is measured from.
//
// Inside the clip the cover is a box around the image rather than the image itself, because GSAP and
// CSS cannot both drive scale on one element. The first transform tween folds that element's computed
// `scale` into `transform` and writes `scale: none` inline, and inline outranks any class — so a
// scale on the drifting element is dead on arrival, hover variants included. The wrapper takes the
// drift; the scale stays on the image, where hover can still animate it.
//
// The two scales are one apart, and the lower is the floor ScrollReveal's ±5% drift needs: 1.2 at
// rest, 1.1 under the pointer, each overhanging the clip far enough to keep an edge covered at the
// ends of the scroll. Pulling the hover in further means taking the rest scale up with it.
export default function ProjectGridItem(
	{ project, className }:
	{ project: ProjectListType, className: string }
) {
	const { slug, img, title, category } = project

	return (
		<ScrollReveal className={className}>
			<Link href={`/projects/${slug}`} className="group block">
				<div className="relative h-full overflow-hidden">
					<div data-parallax className="absolute inset-0">
						<Image
							src={buildImageUrl(img, CARD)}
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="
								object-cover scale-120 transition-[scale]
								duration-300 ease-out group-hover:scale-110
								group-focus-visible:scale-110
							" />
					</div>
				</div>
				<h3 className="flex justify-between gap-small mt-small text-body-1">
					<span className={CAPTION_UNDERLINE}>{title}</span>
					{category && <span className={`font-serif ${CAPTION_UNDERLINE}`}>{category}</span>}
				</h3>
			</Link>
		</ScrollReveal>
	)
}
