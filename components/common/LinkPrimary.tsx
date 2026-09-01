"use client"

import Link from "next/link"
import clickChangesNothing from "@/utils/clickChangesNothing"

type LinkPrimaryProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	disabled?: boolean
}

// The look lives in globals.css as .link-primary, because the close on a dialog wears it too and
// that one is a button — see VideoBlogGridShowOverlay.
//
// A client component, and only because a click handler cannot exist without one — the same trade
// ProjectsHeaderCategory makes, and for the same guard. Nothing else in here needs the browser.
export default function LinkPrimary({ href, children, className = "", target = "_self", disabled }: LinkPrimaryProps) {
	return (
		<Link
			href={href}
			target={target}
			aria-disabled={disabled}
			// See clickChangesNothing. Written this way round on purpose: the early return means
			// preventDefault only ever runs on the click that was going to change nothing, and every
			// other click falls through to the anchor untouched — prefetch, cmd-click, middle-click and
			// the pre-hydration click all behave as they would on any other link.
			onClick={event => {
				if (!clickChangesNothing(href, target)) return
				event.preventDefault()
			}}
			className={`link-primary ${className}`.trim()}>
			{children}
		</Link>
	)
}
