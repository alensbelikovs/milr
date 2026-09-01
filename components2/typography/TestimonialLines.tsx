"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/utils/gsap"

// How long the window has to stay still before the resize counts as finished.
const RESIZE_END_DELAY = 200

// Shared by the quote and its footnote so the two travel as one. Any difference between them would
// read as one of them lagging behind the other.
const ENTER = { duration: 1.5, ease: "expo.out", stagger: 0.1 }
const EXIT = { duration: 0.5, ease: "power2.in", stagger: 0.05 }

// Splits its children into lines, reveals them once on scroll, and — when `token` changes — plays
// the lines on screen out before bringing the new ones in. Both halves of a testimonial go through
// this, which is what puts them on the same beat.
//
// Not TextLineReveal, which is a mount-once reveal: its ScrollTrigger is `once: true` and it offers
// no way to send lines back where they came from. The entrance below is deliberately the identical
// fromTo, so a swapped-in line and a first-scrolled line look the same.
//
// A token rather than a comparison of the children themselves, because children are rebuilt on every
// render and their identity says nothing about whether the words in them changed.
export default function TestimonialLines(
	{ token, children }:
		{ token: string; children: ReactNode })
{
	const elementRef = useRef<HTMLDivElement>(null)

	// What is on screen, which trails what was handed in: the arriving lines cannot be rendered until
	// the leaving ones have gone. The token travels with the children because it is also the key
	// below, and the two must never disagree about which testimonial is showing.
	const [shown, setShown] = useState({ token, children })

	// Read through a ref so the swap effect can be keyed on the tokens ALONE. Keyed on children as
	// well, a parent re-rendering for any other reason would change their identity, and the cleanup
	// would kill an exit that was still playing.
	//
	// Kept current from an effect rather than assigned during render, which is not a write React
	// allows. It is declared above the swap so it lands first in the same commit, and the swap's
	// onComplete reads it later still.
	const childrenRef = useRef(children)
	useEffect(() => { childrenRef.current = children })

	// Held out here rather than inside the effect, because the swap below reads them from outside it.
	const maskSplitRef = useRef<SplitText | null>(null)
	const revealSplitRef = useRef<SplitText | null>(null)

	const hasRevealedRef = useRef(false)
	const isSwappingRef = useRef(false)

	// Splits whatever is currently shown, and splits the replacement after every swap. revertOnUpdate
	// so the cleanup actually runs when `shown` changes — without it the resize listener would be
	// added again on every swap and never taken off.
	useGSAP(() => {
		let revealTween: gsap.core.Tween | null = null
		let scrollTrigger: ScrollTrigger | null = null

		const split = () => {
			// Outer split wraps each line in an overflow-hidden mask; the inner split re-wraps the same
			// text so its lines can travel inside that mask — in either direction.
			maskSplitRef.current = SplitText.create(elementRef.current, {
				type: "lines",
				linesClass: "overflow-hidden",
			})
			revealSplitRef.current = SplitText.create(maskSplitRef.current.lines, { type: "lines" })
		}

		const unsplit = () => {
			scrollTrigger?.kill()
			revealTween?.kill()
			// Inner split first: reverting the outer one restores the original markup.
			revealSplitRef.current?.revert()
			maskSplitRef.current?.revert()
			scrollTrigger = null
			revealTween = null
			revealSplitRef.current = null
			maskSplitRef.current = null
		}

		// overwrite, so an exit still travelling on these lines is killed outright rather than left to
		// drive yPercent against this for the rest of its duration.
		const enter = () => {
			revealTween = gsap.fromTo(revealSplitRef.current!.lines,
				{ yPercent: 100, scale: 0.9 },
				{ yPercent: 0, scale: 1, overwrite: true, ...ENTER }
			)
		}

		split()

		if (isSwappingRef.current) {
			// A freshly mounted element, arriving from a swap. This is a layout effect, so it runs
			// before the browser paints, and fromTo applies its from-values immediately — the new lines
			// are below their masks before anything is drawn.
			isSwappingRef.current = false
			hasRevealedRef.current = true
			enter()
			// A quote of a different length takes a different number of lines, so the section is a
			// different height and every trigger below it was measured against the old one.
			ScrollTrigger.refresh()
		} else if (!hasRevealedRef.current) {
			gsap.set(revealSplitRef.current!.lines, { yPercent: 100, scale: 0.9 })

			scrollTrigger = ScrollTrigger.create({
				trigger: elementRef.current,
				start: "top bottom",
				once: true,
				onEnter: () => {
					hasRevealedRef.current = true
					enter()
				},
			})
		}
		// Anything else is a resize re-split of lines already on screen, so they stay where they land.

		let resizeEndTimeout = 0
		// Only width affects where lines break, and mobile browsers fire resize on
		// every URL-bar show/hide, so height-only changes are ignored.
		let lastWidth = window.innerWidth

		const onResize = () => {
			clearTimeout(resizeEndTimeout)
			resizeEndTimeout = window.setTimeout(() => {
				if (window.innerWidth === lastWidth) return
				lastWidth = window.innerWidth

				unsplit()
				split()
				ScrollTrigger.refresh()
			}, RESIZE_END_DELAY)
		}

		window.addEventListener("resize", onResize)

		return () => {
			window.removeEventListener("resize", onResize)
			clearTimeout(resizeEndTimeout)
			unsplit()
		}
	}, { dependencies: [shown], scope: elementRef, revertOnUpdate: true })

	// Plays what is on screen out, then hands over to the effect above to bring the next one in.
	//
	// A plain effect rather than useGSAP: this tween has to outlive the render that starts it, since
	// the swap it completes is what causes the next render, and a context cleanup would kill it
	// mid-flight.
	useEffect(() => {
		if (token === shown.token) return

		const lines = revealSplitRef.current?.lines

		// Nothing split to play out — a change landing before the first split — so hand straight over
		// and let it animate in.
		if (!lines) {
			isSwappingRef.current = true
			setShown({ token, children: childrenRef.current })
			return
		}

		// overwrite is what stops a half-finished entrance from fighting this for the same property.
		// Without it both tweens drive yPercent on the same lines and the text jitters between them,
		// which is what fast paging looked like.
		const tween = gsap.to(lines, {
			yPercent: -100,
			overwrite: true,
			...EXIT,
			onComplete: () => {
				isSwappingRef.current = true
				setShown({ token, children: childrenRef.current })
			},
		})

		// A newer token mid-flight kills this where it stands and the effect re-runs against the lines
		// wherever they got to, skipping the page nobody waited to see.
		return () => { tween.kill() }
	}, [token, shown.token])

	// Keyed, and that is what makes a swap show different words at all.
	//
	// SplitText does not put the element back the way it found it: revert restores the content by
	// rewriting innerHTML, which builds new nodes. React went on holding references to the text nodes
	// it created before the split, so an ordinary update wrote the new testimonial into nodes that
	// were no longer in the document — the animation played and the words never changed.
	//
	// A changing key means React never patches that subtree. It drops the whole element and mounts a
	// fresh one, which it then owns outright, and the split starts over on markup it just built. The
	// element being replaced is one React created and SplitText only ever reached inside, so removing
	// it is safe in a way that patching its insides was not.
	return <div key={shown.token} ref={elementRef}>{shown.children}</div>
}
