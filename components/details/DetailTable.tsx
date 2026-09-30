"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// How far apart consecutive rows start — and, inside the one row that holds several values, how far
// apart those are. One step per FACT: a row's label and its first value belong to the same fact and
// share a start, while a second and third value are each their own.
const STAGGER = 0.1

// The same travel and timing every other reveal on the site uses.
const REVEAL = { duration: 1.2, ease: "expo.out" }

// The facts about a work, one per row — see DetailTableRow. A placeable container in the same spirit
// as Body36Container: it carries its own place in the section's grid and takes a className for
// whatever the call site wants to add.
//
// The rows rise out of their masks one after another, which is TextLineSplit's entrance with the
// cutting left out: nothing in a row is long enough to break into lines the reader would follow, and
// a value that did would be one fact arriving in pieces.
//
// The trigger is on the TABLE rather than on each row, which is what makes it one cascade. Per-row
// triggers would fire as each row was scrolled to, so the stagger would only ever show on the rows
// still below the fold and the table would assemble itself in fits as the reader moved.
export default function DetailTable(
	{ children, className = "" }:
		{ children: ReactNode; className?: string }) {
	const scopeRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const table = scopeRef.current
		if (!table) return

		// 64rem is Tailwind's lg, the same line every reveal on the site draws. Below it the table is
		// simply there — so there is no state in which a row is held out of sight by an animation that
		// is not going to run.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			// Read from the DOM rather than kept in ref arrays: the rows arrive as children, so this
			// never holds anything it could put a ref on. The query is the list, in the order it is
			// drawn.
			const rows = gsap.utils.toArray<HTMLElement>("[data-table-row]", table)

			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: table,
					start: "top bottom",
					once: true,
				},
			})

			rows.forEach((row, index) => {
				const label = row.querySelector<HTMLElement>("[data-table-label]")
				const values = gsap.utils.toArray<HTMLElement>("[data-table-value]", row)

				const targets = label ? [label, ...values] : values
				if (targets.length === 0) return

				// One tween per row, placed by the row's own index, so the rows step 0.1 apart whatever
				// any of them holds inside.
				//
				// The stagger is worked out per target rather than handed over as a number, because
				// the delays inside a row are not even: the label and the first value start together —
				// indexOf finds the label nowhere and the floor pins it to 0 — and each further value
				// waits one more step. A plain stagger would put the label a step ahead of its own
				// value.
				//
				// from, so the rows are held below their masks from the moment this runs rather than
				// after a frame spent at their resting place.
				timeline.from(targets, {
					yPercent: 120,
					...REVEAL,
					stagger: (_index, target: HTMLElement) =>
						Math.max(0, values.indexOf(target)) * STAGGER,
				}, index * STAGGER)
			})
		})

		// Dropping below lg kills the timeline and its trigger and puts the rows back where they
		// belong — never stranded under their masks.
		return () => { mm.revert() }
	}, { scope: scopeRef })

	return (
		<div ref={scopeRef} className={`
			col-start-1 col-span-full
			md:col-start-2 md:col-span-10
			lg:col-start-6 lg:col-span-6
			${className}`}>
			{children}
		</div>
	)
}
