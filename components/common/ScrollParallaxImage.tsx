import Image from "next/image"
import type { SanityImageSource } from "@sanity/image-url"
import buildImageUrl, { CARD } from "@/utils/buildImageUrl"

// The drifting half of a revealing picture, split out so it can be swapped without disturbing the
// reveal above it. Nesting is the whole point: ScrollReveal animates the box it is given, this
// animates inside that box, and because they sit at different levels the picture can change without
// the entrance replaying.
//
// It owns no ScrollTrigger and no ref of its own. data-parallax is the entire contract — ScrollReveal
// scopes its useGSAP to its own subtree and queries for that attribute, so mounting this anywhere
// inside one is what wires the drift up. That is also why this can stay a server component: the
// element is marked here, driven there.
//
// absolute inset-0, so it fills whatever clip it is dropped into and takes its ratio from that box
// rather than bringing one. The parent decides the shape; this decides what moves inside it.
//
// The scale is on the image and never on this element, because GSAP and CSS cannot both drive scale
// on one box. ScrollReveal scrubs yPercent here, and the first transform tween folds this element's
// computed `scale` into `transform` and writes `scale: none` inline — inline outranks any class, so a
// scale class on this div would be dead on arrival. 1.2 is also the floor the ±7% drift needs: the
// image overhangs the clip by a tenth at each end, and anything less exposes an edge at the extremes.

export default function ScrollParallaxImage(
	{ img, alt = "" }:
	{ img: SanityImageSource, alt?: string }
) {
	return (
		<div data-parallax className="absolute inset-0">
			<Image
				src={buildImageUrl(img, CARD)}
				alt={alt}
				fill
				sizes="(max-width: 768px) 100vw, 50vw"
				className="object-cover scale-120" />
		</div>
	)
}
