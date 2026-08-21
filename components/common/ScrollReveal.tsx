"use client"

import { useRef } from "react"
import type { ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// Where the contents start, relative to the resting place they animate to.
const FROM_Y = "50vh"

const DURATION = 1.2
const EASE = "expo.out"

// How much of the box has to be on screen before the reveal fires, as a fraction of its own height.
const TRIGGER_RATIO = 0.2

// Where a caller's delay is honoured, and its exact complement. 48rem is Tailwind's md. Above it the
// grids have the width to spread a row out, and a step between cards reads as that row arriving in
// sequence; below it there is no room for the sequence to land in, and the same step only reads as
// one card being late.
//
// The complement is written as a negation rather than a max-width, because the two have to tile the
// whole range with no seam. gsap.matchMedia runs a callback only while one of its queries matches, so
// a width that falls between them is a box whose reveal is never built — it would simply sit there,
// untweened, while every other box on the page animated.
const STAGGERED = "(min-width: 48rem)"
const STACKED = `not all and ${STAGGERED}`

// Inner parallax. The travel is symmetric, and the room for it is scale the card has to bring
// itself: drifting ±5% means overhanging the clip by 5% on every side, so anything under 1.1 exposes
// an edge at the extremes. Raising the travel without raising the cards' scale to match is what
// makes gaps appear.
//
// That scale cannot live on the marked element, which is why the cards mark a wrapper and scale the
// image inside it. GSAP folds an element's computed CSS `scale` into `transform` the first time it
// tweaks its transform and writes `scale: none` inline, and inline outranks a class — so a scale
// class on whatever this tween touches goes dead, taking any hover variant of it along.
const PARALLAX_FROM_Y = 5
const PARALLAX_TO_Y = -5

// A trigger box that stays put while everything inside it slides up into place, once, on scroll.
//
// The split matters: ScrollTrigger measures its start against the trigger element, so animating the
// same element it is triggered by moves the measurement along with the animation, and every refresh
// re-reads a start that has shifted. This box never transforms — its children do.
//
// Takes children rather than doing the animating from inside a card, so the card can stay a server
// component. ProjectGridItem builds Sanity image URLs, and pulling that into a client component drags
// the Sanity client into the browser bundle for nothing.
//
// delay is for boxes that share a row, whose triggers all fire at the same scroll position: a step
// between them is what turns three simultaneous reveals into one gesture. It is spent waiting after
// the trigger fires, so the reveal still belongs to the scroll that earned it.
export default function ScrollReveal(
	{ className, delay = 0, children }:
	{ className?: string, delay?: number, children: ReactNode }
) {
	const triggerRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const trigger = triggerRef.current
		if (!trigger) return

		const reveal = (startDelay: number) => {
			gsap.fromTo(trigger.children,
				{ y: FROM_Y },
				{
					y: 0,
					duration: DURATION,
					ease: EASE,
					delay: startDelay,
					scrollTrigger: {
						trigger,
						// "20% bottom" reads as: the point a fifth of the way down the box has reached the
						// bottom of the viewport — which is the box being 20% on screen.
						start: `${TRIGGER_RATIO * 100}% bottom`,
						// A reveal, not a scroll-linked effect: it plays on the way in and stays played, and
						// the trigger kills itself once it has.
						once: true,
					},
				}
			)
		}

		// Two ranges rather than one tween reading a media query, because the answer has to survive a
		// resize: matchMedia reverts the branch that stops matching and builds the other one.
		const mm = gsap.matchMedia()
		mm.add(STAGGERED, () => { reveal(delay) })
		mm.add(STACKED, () => { reveal(0) })

		// Opt-in, by marking a descendant: the reveal above is what every box gets, and only some have
		// something inside worth drifting. A second ScrollTrigger rather than a second tween on the
		// first one, because this one spans the box's whole pass through the viewport and scrubs,
		// where the reveal fires once at 20% and plays on its own clock.
		//
		// Outside the matchMedia on purpose. The drift is the same at every width, and rebuilding it on
		// every crossing would only hand it a fresh scrub to jump from.
		const parallaxTarget = trigger.querySelector("[data-parallax]")
		if (!parallaxTarget) return

		gsap.fromTo(parallaxTarget,
			{ yPercent: PARALLAX_FROM_Y },
			{
				yPercent: PARALLAX_TO_Y,
				// Linear, so position maps straight to scroll — any ease here reads as the image
				// lagging and catching up against the scroll.
				ease: "none",
				scrollTrigger: {
					trigger,
					// The box's whole pass through the viewport: from its top touching the bottom edge
					// to its bottom leaving the top edge.
					start: "top bottom",
					end: "bottom top",
					scrub: true,
				},
			}
		)
	}, { scope: triggerRef, dependencies: [delay] })

	// relative so the box is a containing block for anything absolutely positioned inside it, and so a
	// z-index has something to apply to while the contents sit off their resting place.
	return (
		<div ref={triggerRef} className={`relative ${className ?? ""}`}>
			{children}
		</div>
	)
}
