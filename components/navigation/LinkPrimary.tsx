import Link from "next/link"

type LinkPrimaryProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	disabled?: boolean
}

export default function LinkPrimary({ href, children, className = "", target = "_self", disabled }: LinkPrimaryProps) {
	return (
		<Link
			href={href}
			target={target}
			aria-disabled={disabled}
			className={`inline-block hover:underline-offset-4 text-body-1 hover:underline focus-visible:underline aria-disabled:opacity-30 aria-disabled:cursor-not-allowed aria-disabled:no-underline ${className}`.trim()}>
			{children}
		</Link>
	)
}
