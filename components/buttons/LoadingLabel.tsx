"use client"
import { useRef } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// What the button says while it is waiting, in the order it says it. At the top of the file because
// this is the part anyone will come here to change — the machinery below does not care how many
// there are or what they say.
const LABELS = ["Sending", "Almost there", "One moment"]

// How long a label stands still before it leaves.
const HOLD = 1

// The exchange itself: the leaving label and the arriving one are given the same curve and the same
// second, so they read as one movement rather than two things that happened to overlap.
const TRAVEL = { duration: 1, ease: "expo.out" }

// How far out of the clip a label waits, as a share of its own height. Past its own box rather than
// flush with the edge at 100: flush leaves the two labels touching at the moment they pass, so the
// exchange reads as a strip being dragged rather than as one label replacing another — and it puts
// any part of a glyph the line box does not account for safely out of sight.
const OFFSCREEN = 120

// The button's words while it is busy, taking turns: each holds for a second, then slides up and out
// while the next rises into the space it left. It loops for as long as it is mounted, which is the
// whole of the wait — the form never puts its loading state back (see ContactForm), so there is no
// end state for this to settle on.
//
// No props. It is one button's loading label and it knows its own copy; what it does not know is
// when it is on screen, which is the caller's business — BodyButton mounts it only while busy, and
// mounting is what starts the cycle.
export default function LoadingLabel() {
	const trackRef = useRef<HTMLSpanElement>(null)

	// useGSAP owns the teardown: the timeline is built in its context, so unmounting kills it and
	// puts the labels' inline transforms back.
	useGSAP(() => {
		const track = trackRef.current
		if (!track) return

		const labels = gsap.utils.toArray<HTMLElement>("[data-loading-label]", track)

		// One label has nothing to hand over to — the cycle below would animate it out and back into
		// itself. It is already in the right place, so leaving it alone is the whole of that case.
		if (labels.length < 2) return

		// Everything waits below the clip except the one being read.
		gsap.set(labels, { yPercent: OFFSCREEN })
		gsap.set(labels[0], { yPercent: 0 })

		// One step per label, each ending on the next — and the last ending on the first, which is
		// what makes it a cycle rather than a list that runs out.
		//
		// The repeat needs no reset step: repeating rewinds the timeline to its start, and rewinding
		// puts every tween back to the value it recorded when it was built, which is exactly the
		// arrangement the two sets above made.
		const cycle = gsap.timeline({ repeat: -1 })
		labels.forEach((label, index) => {
			const next = labels[(index + 1) % labels.length]

			cycle
				// The hold is the gap before this tween rather than a wait inside it, so it is a second
				// of stillness on screen and not a second of a tween that looks stopped.
				.to(label, { yPercent: -OFFSCREEN, ...TRAVEL }, `+=${HOLD}`)
				// "<" starts this with the one above rather than after it. fromTo, not from, because
				// this label has been somewhere else since the last pass and the start has to be said
				// out loud for the cycle to be repeatable.
				//
				// immediateRender off, and the first second of the animation depends on it. A fromTo
				// renders its from state the moment it is MADE, timeline or no timeline — so the last
				// step, which brings the first label back round, would park that label below the clip
				// while this is still being built, undoing the set above. The button would open on an
				// empty box and the first label would fly through it instead of holding still.
				.fromTo(next,
					{ yPercent: OFFSCREEN },
					{ yPercent: 0, immediateRender: false, ...TRAVEL },
					"<")
		})
	}, { scope: trackRef })

	return (
		// flex-1 is "the rest of the button": inside BodyButton's flex row this takes everything the
		// spinner at the far end leaves. relative is what the stacked labels are positioned against,
		// and overflow-hidden is the clip the whole effect is — without it the labels simply travel
		// across the rest of the page.
		//
		// text-left, because a button centres its text by the browser's own rules and that reaches in
		// here. It never showed on the label this replaces — that one is only as wide as its words, so
		// centring it inside itself moves nothing. This box is as wide as the button, and without this
		// every line would sit in the middle of it and the labels would look like they were taking
		// turns in a different place each time.
		//
		// aria-hidden, because three labels stacked in one box would be read out as one run-on line.
		// The button keeps its own name for that — see BodyButton.
		<span ref={trackRef} aria-hidden className="relative flex-1 overflow-hidden text-left">
			{LABELS.map((label, index) => (
				// The first label stays in the flow and the rest are stacked over it, which is what
				// holds the box open: while this is showing, it is the only thing in the button with a
				// line box in it, and with every label taken out of the flow the row would collapse
				// onto the 12px spinner and the button would shrink the moment it was pressed. A
				// translated label still occupies its box, so the height stays where it started.
				//
				// block on all of them because a transform does nothing to an inline box — the same
				// reason TextMaskReveal gives for the span inside its mask.
				//
				// Keyed by index, which is right for a fixed list declared in this file: nothing
				// reorders it, and two labels are free to say the same thing.
				<span
					key={index}
					data-loading-label
					className={`block ${index === 0 ? "" : "absolute inset-x-0 top-0"}`}>
					{label}
				</span>
			))}
		</span>
	)
}
