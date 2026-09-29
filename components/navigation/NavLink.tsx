import Link from "next/link"
import type { MouseEvent } from "react"

// scroll passes straight through to Link. Off where TransitionControl owns the scroll — see
// FilterNav — and left at Link's default everywhere else.
export default function NavLink(
	{ href, active, onClick, children, target, scroll }: {
		href: string
		active?: boolean
		onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
		children: React.ReactNode
		target?: string
		scroll?: boolean
	}
) {
	return (
		<Link
			href={href}
			onClick={onClick}
			scroll={scroll}
			className={`text-size-16 transition-colors hover:underline ${active ? "text-current" : "text-current/50"}`}
			target={target}
		>
			{children}
		</Link>
	)
}
