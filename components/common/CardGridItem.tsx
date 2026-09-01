import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import type { SanityImageSource } from "@sanity/image-url"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"
import ScrollReveal from "@/components/common/ScrollReveal"

// The one card both full-page grids are built from. A project and a video blog differ in exactly two
// ways — where pressing one goes, and what its caption says — so those are the two props that vary
// and everything else below is shared. ProjectGridItem and VideoBlogGridItem are now the info boxes
// and nothing more.
//
// Two boxes, because a variant needs to say two things. The outer box is the grid item, so it
// carries the placement, and the card is what the variant's *: classes reach — which is what lets a
// variant span the whole row for itself and still put its card on columns 9-12.
//
// That outer box is ScrollReveal, which adds nothing to the depth: the variant still lands one level
// above the card, so *:aspect-* keeps reaching it. Nothing may be inserted between the two — a
// wrapper in there would take the aspect for itself and collapse the cover, whose height comes from
// h-full resolving against the card.
//
// The aspect lands on the card, so it measures the cover alone and the caption rides below it. That
// keeps every cover at the ratio its variant names whatever the caption wraps to, at the cost of the
// caption sitting outside the box the row is measured from.
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
type CardGridItemProps = {
	img: SanityImageSource,
	alt: string,
	className: string,
	delay?: number,
	info: ReactNode
} & (
	// A card either goes somewhere or does something, never both and never neither. Written as a
	// union rather than two optional props so a card with no press behaviour at all — a cover nothing
	// reacts to — cannot be constructed by leaving both off.
	| { href: string, onPress?: never }
	| { href?: never, onPress: () => void }
)

// group here rather than on the interactive element inside, because both the cover's scale and the
// caption's underline are hover states of the whole card. The pointer is only ever over one of them,
// so a bare hover: variant would light that one and leave the rest of the card cold.
const CARD_BOX = "group block"

// The one line the link does not need. The aspect measures the cover alone and the caption is meant
// to hang below that box — a link lets it, where a button's own box is entitled to clip its contents
// and the caption would simply vanish. text-left and w-full undo the rest of the button defaults.
const CARD_BUTTON_BOX = `${CARD_BOX} w-full overflow-visible text-left cursor-pointer`

export default function CardGridItem(props: CardGridItemProps) {
	const { img, alt, className, delay, info } = props

	const card = (
		<>
			<div className="relative h-full overflow-hidden">
				<div data-parallax className="absolute inset-0">
					<Image
						src={buildImageUrl(img, CARD)}
						alt={alt}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="
							object-cover scale-120 transition-[scale]
							duration-300 ease-out group-hover:scale-110
							group-focus-visible:scale-110
						" />
				</div>
			</div>
			{info}
		</>
	)

	// Not destructured, because destructuring the union loses the narrowing that makes href and
	// onPress exclusive — read off props, the check below tells TypeScript which half it is holding.
	if (props.href !== undefined) {
		return (
			<ScrollReveal className={className} delay={delay}>
				<Link href={props.href} className={CARD_BOX}>{card}</Link>
			</ScrollReveal>
		)
	}

	// A button, because there is nowhere for a link to go: the player opens as a dialog on the page
	// the card is already on and the URL never moves, so no address names it and an href could only
	// promise one that does not resolve. The card reports that it was pressed; the grid decides what
	// that means.
	return (
		<ScrollReveal className={className} delay={delay}>
			<button
			type="button"
			onClick={props.onPress}
			aria-haspopup="dialog"
			className={CARD_BUTTON_BOX}
			>
				{card}
			</button>
		</ScrollReveal>
	)
}
