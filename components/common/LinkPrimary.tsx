import Link from "next/link"

type LinkPrimaryProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	disabled?: boolean
}

// The look lives in globals.css as .link-primary, because the close on a dialog wears it too and
// that one is a button — see VideoBlogGridShowOverlay.
export default function LinkPrimary({ href, children, className = "", target = "_self", disabled }: LinkPrimaryProps) {
	return (
		<Link
			href={href}
			target={target}
			aria-disabled={disabled}
			className={`link-primary ${className}`.trim()}>
			{children}
		</Link>
	)
}
