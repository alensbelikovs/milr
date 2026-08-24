import type { ReactNode } from "react"

// The slot a footer element is revealed through: it clips to the element's own box, so what sits
// inside can start a full height below and slide up into place.
//
// It only marks its contents with data-reveal — the tweens live in Footer. Every reveal down there is
// timed off one ScrollTrigger, and a trigger per mask would fire a screen too early: the footer is
// pulled up by a whole viewport, so its elements are "in view" long before they are on screen.
//
// Worth knowing: overflow-hidden clips at the line box, so anything drawn below it — a deep
// descender, a hover underline sitting a few pixels under the baseline — is cut off. Buying room
// means padding the inner element and taking the same amount back off this one with a negative
// margin; padding this one alone would leave the contents visible in it before they animate.
export default function RevealMask(
	{ children, className }:
	{ children: ReactNode, className?: string }
) {
	return (
		<div className={`relative overflow-hidden ${className ?? ""}`.trim()}>
			<div data-reveal>{children}</div>
		</div>
	)
}
