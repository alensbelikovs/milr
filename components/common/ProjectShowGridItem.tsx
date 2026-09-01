import type { SanityImageSource } from "@sanity/image-url"
import ScrollReveal from "@/components/common/ScrollReveal"
import ScrollParallaxImage from "@/components/common/ScrollParallaxImage"

// A picture on the grid, and nothing else. Where CardGridItem is a card — something to press, with a
// caption naming what it is — a gallery image is the work itself: there is no second page to reach
// and nothing to say about it that the project around it has not already said.
//
// Which is why it is a separate component rather than CardGridItem with its parts turned off. The
// two share a rhythm, not a shape: strip the link and the caption from a card and what is left is
// this, so this is written as what it is.
//
// Three levels, and each owns one thing. ScrollReveal is the entrance and the trigger box. The div
// below it is the clip and the ratio. ScrollParallaxImage is the picture and the drift. Split that
// way, the innermost can change without the outermost noticing — which is what Testimonials needs
// and what a gallery, whose images never swap, gets for free.
//
// The variant lands on ScrollReveal, the grid item, and its *:aspect-* reaches ONE level below —
// which here is the clip. That is the difference from CardGridItem worth knowing: there the aspect
// sits on the link and the clip fills it with h-full, so a caption can hang outside the measured
// box. Nothing hangs off this one, so the clip takes the ratio itself and h-full would be a height
// resolving against nothing.
//
// alt="" because a gallery image has no alt to carry — see SCHEMA.md, where the field was dropped on
// purpose. These are decorative, and an empty alt is what tells a screen reader to pass over them
// rather than read out an asset name.
export default function ProjectShowGridItem(
	{ img, className }:
	{ img: SanityImageSource, className: string }
) {
	return (
		<ScrollReveal className={className}>
			<div className="relative overflow-hidden">
				<ScrollParallaxImage img={img} />
			</div>
		</ScrollReveal>
	)
}
