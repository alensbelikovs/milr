import Link from "next/link"

const CLASS = "font-serif p-size-16 text-size-18"

// One page number. A page of a list is an address — worth sharing, worth going Back to — so a number
// is a real link rather than a button.
//
// The current page renders as a span: a link to the page already showing is a navigation that does
// nothing, and a stop on the way through for anyone tabbing. aria-current marks it instead.
//
// scroll is off because TransitionControl does the scrolling, under the curtain.
export default function PaginationStepButton(
	{ step, href, active = false }:
	{ step: number, href: string, active?: boolean }
) {
	if (active) {
		return <span aria-current="page" className={`${CLASS} underline`}>{step}</span>
	}

	return (
		<Link href={href} scroll={false} className={`${CLASS} text-current/50 hover:underline cursor-pointer`}>
			{step}
		</Link>
	)
}
