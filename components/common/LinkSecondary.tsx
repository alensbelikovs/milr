import Link from "next/link"

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
export default function LinkSecondary({ href, children, noPadding, className = "", target = "_self", disabled }: LinkSecondaryProps) {
	return (
		<Link
			href={href}
			target={target}
			aria-disabled={disabled}
			className={`link-secondary ${noPadding ? "p-[0px]" : "p-[12px]"} ${className}`.trim()}>
			{children}
		</Link>
	)
}
