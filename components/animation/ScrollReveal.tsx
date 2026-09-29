"use client"
import { useRef } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// How long each step of the stagger waits. Small, because it multiplies: the last card in a row
// carries the whole of it before it starts.
const STAGGER = 0.08

// Lifts the box it is dropped into into place the first time it is scrolled to. Draws nothing and
// wraps nothing — it animates its PARENT, which is the contract: drop it inside the element you want
// revealed. That is what lets a server component opt in without a client boundary of its own, and
// what keeps it out of the grid: an extra wrapper would take the card's place in it and drop the
// column each card is positioned into.
//
// index is the card's position in its row, not in the list. A card below the fold has its own
// trigger and fires on its own way in, so staggering by position in the whole grid would leave the
// last card waiting a second after it was already looked at.
export default function ScrollReveal({ index = 0 }: { index?: number }) {
	const anchorRef = useRef<HTMLSpanElement>(null)

	useGSAP(() => {
		const target = anchorRef.current?.parentElement
		if (!target) return

		// 48rem is Tailwind's md. Both queries are given so that one of them always matches —
		// matchMedia runs the callback for whichever is true, and the delay is the only thing that
		// differs. Below md the grid is a column tall enough that a stagger is just a wait: the cards
		// arrive one screen at a time anyway.
		const mm = gsap.matchMedia()
		mm.add({ wide: "(min-width: 48rem)", narrow: "(max-width: 47.999rem)" }, context => {
			const delay = context.conditions?.wide ? index * STAGGER : 0

			// The same travel and timing as TextBlockReveal, so a card and the copy beside it arrive
			// as one movement: a quarter of the viewport, in pixels and re-measured on every refresh.
			const rise = () => window.innerHeight * 0.25

			// from, so the card is held out of sight from the moment this runs rather than after a
			// frame at its resting place. once, because an entrance is an entrance — scrolling back
			// up should find the grid where it was left. autoAlpha rather than TextBlockReveal's
			// plain opacity: a card is a link or a button, and one that is invisible should not
			// also be clickable.
			gsap.from(target, {
				autoAlpha: 0,
				y: rise,
				duration: 1.2,
				ease: "expo.out",
				delay,
				invalidateOnRefresh: true,
				scrollTrigger: {
					trigger: target,

					// The card is its own trigger — it has no wrapper to measure instead, since one
					// would take its cell in the grid — and ScrollTrigger measures it with the from
					// state applied: it re-renders a from() at its start before every measurement.
					// So the card is measured a rise lower than where it belongs, and the start is
					// pulled up by the same function to cancel it. It fires when the card's real
					// place reaches the bottom of the screen, the moment TextBlockReveal's does.
					start: () => `top-=${rise()} bottom`,
					once: true,
				},
			})
		})

		return () => { mm.revert() }
	}, { dependencies: [index], scope: anchorRef })

	// display:none, so it takes no space and no cell in whatever grid it lands in. It exists only to
	// hand the effect above a parent to animate.
	return <span ref={anchorRef} className="hidden" />
}
