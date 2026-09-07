import Link from "next/link"
import type { MouseEvent } from "react"

export default function NavLink(
	{ href, active, onClick, children, target }: {
		href: string
		active?: boolean
		onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
		children: React.ReactNode
		target?: string
	}
) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={`text-size-16 transition-colors hover:underline ${active ? "text-foreground" : "text-foreground/50"}`}
			target={target}
		>
			{children}
		</Link>
	)
}
