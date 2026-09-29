"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// How far the layer drifts, as a share of its own height, and the scale that pays for it. The two
// numbers are one decision: a tenth of extra height is 5% hanging past each end of the box, which is
// exactly the travel — so the picture reaches either extreme with its edge on the clip and never a
// sliver past it. Change one and the other has to move with it.
const DRIFT = 5
const OVERHANG = 1.1

// A picture that holds still while the page moves past it: it rises through its own box as the box
// crosses the viewport, so the image lags the scroll instead of travelling with it.
//
// It animates the box it renders, never the picture inside — that element already has an owner. Our
// Image plays its own reveal on the <img> the moment the file decodes, and two tweens on one
// element's transform would fight over it. Nesting is what keeps them apart, which is the
// arrangement Image's own comment calls safe: two transforms, two elements.
//
// The children are handed in rather than built from a source, so the call site keeps the decisions
// that belong to it — which size to request, what alt to print, what sizes to promise the browser.
// Gallery makes the same ones a few lines from where it lays its boxes out, and so should anything
// dropping a picture in here.
//
// absolute inset-0: it fills the box it is dropped into and takes its shape from that box rather
// than bringing one. The parent has to be positioned and has to clip — at rest the layer already
// stands a twentieth of its height proud at each end, and unclipped that is both a picture over its
// neighbours and extra page to scroll through.
export default function ImageParallax(
	{ children, className = "" }:
		{ children: ReactNode, className?: string }) {
	const layerRef = useRef<HTMLDivElement>(null)

	// useGSAP owns the teardown: the tween and its trigger are made inside its context, so unmounting
	// kills both and puts the element's inline styles back.
	useGSAP(() => {
		const layer = layerRef.current
		if (!layer) return

		gsap.fromTo(layer,
			{ yPercent: -DRIFT, scale: OVERHANG },
			{
				yPercent: DRIFT,
				scale: OVERHANG,

				// Linear, because the scrollbar is the playhead: any curve here would make the
				// picture drift at a speed the scroll is not moving at.
				ease: "none",
				invalidateOnRefresh: true,
				scrollTrigger: {
					// The parent, not the layer. A trigger is measured where it sits, and this layer is
					// the one thing on the page guaranteed to be somewhere else by then — it is
					// mid-travel at every moment except the exact middle of the range. The box around
					// it stays put and is the box the drift is timed against anyway.
					trigger: layer.parentElement ?? layer,

					// The whole of the crossing: from the box's top at the bottom of the screen to its
					// bottom at the top. A box already on screen at load starts part-way through, which
					// is the point — it opens at the drift its position has earned rather than snapping
					// to one end.
					start: "top bottom",
					end: "bottom top",

					// true, not a number. A numeric scrub smooths towards the scroll position through a
					// tween of its own, and that tween is a child of the global timeline — which
					// utils/gsap holds paused until the page on screen signals ready, so the drift
					// would stall behind the curtain and lurch when it lifted. scrub: true sets the
					// tween's progress outright, which renders whatever the timeline is doing.
					scrub: true,
				},
			})
	}, { scope: layerRef })

	// The scale lives in the tween above rather than in a scale-110 class here, and it has to. The
	// first transform tween folds an element's computed scale into `transform` and writes
	// `scale: none` inline — inline outranks any class, so the class would be dropped the moment the
	// drift started and the picture would fall back to the size of its clip.
	return <div ref={layerRef} className={`absolute inset-0 ${className}`}>{children}</div>
}
