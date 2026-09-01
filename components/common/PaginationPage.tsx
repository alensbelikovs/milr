import Link from "next/link"

// One number in a pagination, in whichever of the two kinds of pagination it finds itself.
//
// A page of /projects IS an address — worth sharing, worth going Back to, worth a crawler following —
// so there it is a real anchor, and that is also the only way anything ever reaches page 2. Which
// quote is showing on the home page is not an address: nothing links to the third testimonial, and
// Back should mean the page before this one rather than the quote before this one. So that one is a
// button over component state.
//
// Written as a union rather than two optional props, so a number that neither goes anywhere nor does
// anything cannot be constructed. The look is defined once here for both, which is the whole point of
// the file: the two paginations differ in what a press MEANS, never in what they are.
//
// The selected number renders as a <span> in both modes. A self-link is a navigation that does
// nothing and a self-selecting button is a press that does nothing, and either way it is a stop on
// the way through for anyone tabbing. aria-current marks it instead — "page" where the number really
// is a page, plain "true" where it is a position in a set that has no addresses.
type PaginationPageProps = { number: number, active?: boolean } & (
	| { href: string, onSelect?: never }
	| { onSelect: () => void, href?: never }
)

const SHARED = "text-body-1 p-[12px]"

const INTERACTIVE = `
	${SHARED} cursor-pointer text-foreground/50
	hover:underline hover:underline-offset-4
	focus-visible:text-foreground
	focus-visible:underline focus-visible:underline-offset-4
`

export default function PaginationPage(props: PaginationPageProps) {
	const { number, active } = props

	if (active) {
		return (
			<span
				aria-current={props.href !== undefined ? "page" : "true"}
				className={`${SHARED} text-foreground`}
			>
				{number}
			</span>
		)
	}

	if (props.href !== undefined) {
		// scroll={false} because Next 16 keeps scroll position when the page element is still in the
		// viewport — clicking Next from the bottom of the grid would land you at the bottom of the next
		// one. TransitionControl does the scrolling, through Lenis, so it stays smooth.
		return (
			<Link href={props.href} scroll={false} className={INTERACTIVE}>
				{number}
			</Link>
		)
	}

	return (
		<button type="button" onClick={props.onSelect} className={INTERACTIVE}>
			{number}
		</button>
	)
}
