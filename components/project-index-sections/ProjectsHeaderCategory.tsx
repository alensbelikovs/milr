"use client"

import SerifNumSpan from "@/components/common/SerifNumSpan"
import Link from "next/link"

// A link, not a button, and that is the whole design of this page in one element. Picking a category
// produces a distinct, addressable state — a URL worth sharing, worth going Back to, worth a crawler
// following — which is the line HTML draws between the two: a button mutates the page it is on, a
// link goes somewhere. Being a real <a href> is also what makes cmd-click work, what lets Next
// prefetch the filtered page on hover, and what keeps the chips working before hydration.
//
// A client component, and only because a click handler cannot exist without one. Nothing else in
// here needs the browser: which chip is selected still arrives as a prop from the page, which
// already awaited searchParams, so there is no useSearchParams and no Suspense boundary to satisfy.
//
// aria-current is the right marker for a link that is the current page. aria-pressed belongs to
// toggle buttons, and putting it on an anchor tells a screen reader this is something it is not. The
// colour says the same thing to everyone else, and neither is load-bearing alone: colour is not
// announced, and aria-current is not seen.
//
// No colour transition. The hover state lands on the frame the pointer arrives, so a row of chips
// answers the pointer rather than catching up to it — a fade reads as lag on something this small.
// The underline appears on the label only, not on the count: see SerifNumSpan for why that works.
export default function ProjectsHeaderCategory(
	{ title, count, href, active }:
	{ title: string, count: number, href: string, active?: boolean }
) {
	return (
		<Link
			href={href}
			aria-current={active ? "page" : undefined}
			// Picking the chip that is already picked is a navigation to the address the page is already
			// on. Left alone the router runs it, refetches the tree and hands fresh children down, and
			// TransitionControl — which sees new children and cannot tell they render the same thing —
			// spends the whole curtain sequence arriving back exactly where it started.
			//
			// The early return is what keeps this from costing anything. preventDefault runs only on the
			// click that was going to change nothing; every other click falls through to the anchor
			// untouched, so prefetch, cmd-click, middle-click and the pre-hydration click all behave as
			// they would on any other link. Calling it unconditionally and pushing through the router
			// instead would cancel the modifier clicks too, on every chip rather than just this one.
			onClick={event => {
				if (!active) return
				event.preventDefault()
			}}
			className={`
				text-body-2 whitespace-nowrap
				hover:underline hover:underline-offset-4
				focus-visible:text-foreground
				focus-visible:underline focus-visible:underline-offset-4
				${active ? "text-foreground" : "text-foreground/50"}
			`}
		>
			{title}<SerifNumSpan sizeClass="text-small" gapClass="ml-micro">{count}</SerifNumSpan>
		</Link>
	)
}
