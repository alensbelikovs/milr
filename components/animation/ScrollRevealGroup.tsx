"use client"
import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/utils/gsap"

// How far apart consecutive targets start when the call site does not say otherwise. The same step
// every other cascade on the site uses.
const STAGGER = 0.1

// The reveal DetailTable plays, which is the entrance this is generalised from: each target rises
// out of a mask of its own. A default rather than the only option, because the travel is the part a
// call site is most likely to want different — a card with no mask around it wants to fade and rise
// instead, the way ScrollReveal does. Whatever is passed replaces this outright rather than merging
// into it, so a call site never has to undo a property it did not ask for.
const REVEAL: gsap.TweenVars = { yPercent: 100, duration: 1.2, ease: "expo.out" }

// ScrollReveal's counterpart for a group that should arrive in order: ONE timeline for everything
// inside, triggered on the group rather than on any of its members.
//
// That difference is the whole point. ScrollReveal gives each element a trigger of its own, so the
// stagger only ever shows on the elements still below the fold and the group assembles itself in
// fits as the reader moves — which is why it staggers by a card's place in its ROW rather than in
// the list. With one trigger on the group, reaching the group is the whole of the cue and the order
// is the order the elements are written in, however they happen to be laid out.
//
// The group renders the element that holds the children, so className is the layout: a grid, a flex
// column, whatever the call site would have written anyway. Nothing is added to the tree, so this
// can take the place of a plain container without disturbing the grid it sits in.
//
// What gets animated is the group's direct children, which asks nothing of them — they do not have
// to carry an attribute or know they are being revealed. selector is the way out for markup where
// that is the wrong set: DetailTable's rows each hold a label and several values, and it is those
// inner pieces that move, not the row. Passing one queries inside the group instead.
//
// tween is read once, on mount, along with stagger and selector — there is no dependency array, the
// same as DetailTable. A call site can write the vars inline without a new object identity tearing
// the timeline down and rebuilding it every render. The other side of that: changing them later
// does nothing, and a group whose contents change needs a key to remount rather than an update.
//
// stagger is applied over the top of tween rather than inside it, so it always wins — and it is
// typed as GSAP's own, which means a number, a function of the target, or a stagger object. A grid
// wanting to arrive by column instead of in document order passes { each, grid, from } and gets it
// without this having to know anything about grids.
export default function ScrollRevealGroup(
	{ children, className = "", tween = REVEAL, stagger = STAGGER, selector }:
		{
			children: ReactNode
			className?: string
			tween?: gsap.TweenVars
			stagger?: gsap.TweenVars["stagger"]
			selector?: string
		}) {
	const scopeRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const group = scopeRef.current
		if (!group) return

		// 64rem is Tailwind's lg, the same line every reveal on the site draws. Below it the content
		// is simply there — so there is no state in which an element is held out of sight by an
		// animation that is not going to run. The whole reveal is inside the query rather than
		// guarded by it, which is what makes crossing down out of lg put everything back.
		const mm = gsap.matchMedia()
		mm.add("(min-width: 64rem)", () => {
			// Read from the DOM rather than kept in ref arrays: the targets arrive as children, so
			// this never holds anything it could put a ref on. The query is the list, in the order it
			// is drawn.
			const targets = selector
				? gsap.utils.toArray<HTMLElement>(selector, group)
				: gsap.utils.toArray<HTMLElement>(group.children)

			// An empty group is a real case — a grid rendered before its content arrives — and
			// gsap.from([]) would only warn about a target it could not find.
			if (targets.length === 0) return

			// from, so the targets are held out of sight from the moment this runs rather than after a
			// frame spent at their resting place. once, because an entrance is an entrance: scrolling
			// back up should find the group where it was left.
			gsap.timeline({
				scrollTrigger: {
					trigger: group,
					start: "top bottom",
					once: true,
				},
			}).from(targets, { ...tween, stagger })
		})

		// Dropping below lg kills the timeline and its trigger and puts the targets back where they
		// belong — never stranded mid-entrance.
		return () => { mm.revert() }
	}, { scope: scopeRef })

	return (
		<div ref={scopeRef} className={className}>
			{children}
		</div>
	)
}
