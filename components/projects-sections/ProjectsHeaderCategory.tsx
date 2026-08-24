import SerifNumSpan from "@/components/common/SerifNumSpan"
import Link from "next/link"

// A link, not a button, and that is the whole design of this page in one element. Picking a category
// produces a distinct, addressable state — a URL worth sharing, worth going Back to, worth a crawler
// following — which is the line HTML draws between the two: a button mutates the page it is on, a
// link goes somewhere. Being a real <a href> is also what makes cmd-click work, what lets Next
// prefetch the filtered page on hover, and what keeps the chips working before hydration.
//
// It stays a server component because of it. The selected chip arrives as a prop from the page,
// which already awaited searchParams, so there is no useSearchParams here — no client bundle for the
// chips, and no Suspense boundary to satisfy the build.
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
			className={`
				text-body-1 whitespace-nowrap
				hover:text-foreground hover:underline hover:underline-offset-4
				focus-visible:text-foreground
				focus-visible:underline focus-visible:underline-offset-4
				${active ? "text-foreground" : "text-foreground/50"}
			`}
		>
			{title}<SerifNumSpan sizeClass="text-small" gapClass="ml-micro">{count}</SerifNumSpan>
		</Link>
	)
}
