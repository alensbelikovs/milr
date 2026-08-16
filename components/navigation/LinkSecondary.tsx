import Link from "next/link"

type LinkSecondaryProps = {
	href: string
	children: React.ReactNode
	className?: string
	target?: string
	disabled?: boolean,
	noPadding?: boolean
}

export default function LinkSecondary({ href, children, noPadding, className = "", target = "_self", disabled }: LinkSecondaryProps) {
	return (
		<Link
			href={href}
			target={target}
			aria-disabled={disabled}
			className={`inline-block ${noPadding ? "p-[0px]" : "p-[12px]"} text-body-1 opacity-60 underline underline-offset-4 hover:opacity-100 focus-visible:opacity-100 aria-disabled:opacity-30 aria-disabled:cursor-not-allowed ${className}`.trim()}>
			{children}
		</Link>
	)
}
