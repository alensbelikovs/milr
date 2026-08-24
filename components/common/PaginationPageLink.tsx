import Link from "next/link"

// A page number, as a link. Same reasoning as the category chips: a page of a list is an addressable
// state, so it gets an href — which is also the only way a crawler ever reaches page 2 and the
// projects on it.
//
// The current page renders as a <span> rather than a link to itself. Self-links are a navigation
// that does nothing, and they put a stop on the way through the pagination for anyone tabbing it.
// aria-current marks it instead, which is what a screen reader announces the position from.
//
// scroll={false} on every link, because Next 16 keeps scroll position when the page element is still
// in the viewport — clicking Next from the bottom of the grid would land you at the bottom of the
// next one. ProjectGridShell's exit does the scrolling, through Lenis, so it stays smooth.
export default function PaginationPageLink(
	{ number, href, active }:
	{ number: number, href: string, active?: boolean }
) {
	const shared = "text-body-1 p-[12px]"

	if (active) {
		return (
			<span aria-current="page" className={`${shared} text-foreground`}>
				{number}
			</span>
		)
	}

	return (
		<Link
			href={href}
			scroll={false}
			className={`
				${shared} cursor-pointer text-foreground/50
				hover:text-foreground hover:underline hover:underline-offset-4
				focus-visible:text-foreground
				focus-visible:underline focus-visible:underline-offset-4
			`}
		>
			{number}
		</Link>
	)
}
