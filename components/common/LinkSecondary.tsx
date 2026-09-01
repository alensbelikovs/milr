"use client"

import Link from "next/link"
import clickChangesNothing from "@/utils/clickChangesNothing"

type LinkSecondaryProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	disabled?: boolean,
	noPadding?: boolean
}

// The look lives in globals.css as .link-secondary, alongside .link-primary. Only the padding is
// still written here, because it is the one part a prop decides.
//
// A client component, and only because a click handler cannot exist without one — the same trade
// ProjectsHeaderCategory makes, and for the same guard.
export default function LinkSecondary({ href, children, noPadding, className = "", target = "_self", disabled }: LinkSecondaryProps) {
	return (
		<Link
			href={href}
			target={target}
			aria-disabled={disabled}
			// See clickChangesNothing, and LinkPrimary for why the early return rather than an
			// unconditional preventDefault.
			onClick={event => {
				if (!clickChangesNothing(href, target)) return
				event.preventDefault()
			}}
			className={`link-secondary ${noPadding ? "p-[0px]" : "p-[12px]"} ${className}`.trim()}>
			{children}
		</Link>
	)
}
