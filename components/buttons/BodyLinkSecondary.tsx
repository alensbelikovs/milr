import Link from "next/link"

// Shared with SolutionButton so the link and the button look the same
export const BODY_SECONDARY = `
	inline-block text-size-16
	underline underline-offset-4 hover:no-underline
	cursor-pointer
`

export default function BodyLinkSecondary({ children, href }: { children: React.ReactNode, href: string }) {
	return (
		<Link className={BODY_SECONDARY} href={href}>
			{children}
		</Link>
	)
}
