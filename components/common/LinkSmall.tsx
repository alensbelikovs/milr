"use client"

import Link from "next/link"
import clickChangesNothing from "@/utils/clickChangesNothing"

type LinkSmallProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
}

// The footnote link: the smallest of the three, and the only one whose look is written here rather
// than in globals.css. The other two live there because a button wears each of them — see the close
// in VideoBlogGridShowOverlay — and nothing but an anchor has ever needed this one. Move it out the
// day something does.
//
// It brings no size of its own. The footer's footnote row sets text-small on the whole row, and a
// link that restated it would be the one element in that row to fight a change to it.
//
// A client component, and only because a click handler cannot exist without one — the same trade
// ProjectsHeaderCategory makes, and for the same guard.
export default function LinkSmall({ href, children, className = "", target = "_self" }: LinkSmallProps) {
	return (
		<Link
			href={href}
			target={target}
			// See clickChangesNothing, and LinkPrimary for why the early return rather than an
			// unconditional preventDefault.
			onClick={event => {
				if (!clickChangesNothing(href, target)) return
				event.preventDefault()
			}}
			className={`hover:underline ${className}`.trim()}>
			{children}
		</Link>
	)
}
