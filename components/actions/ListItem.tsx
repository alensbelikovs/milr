import Link from "next/link"
import type { ComponentProps } from "react"

export type ListLinkItem = { label: string; href: string }

export default function ListItem(
	{ children, href, index, hovered, ...rest }:
	ComponentProps<"li"> & { href: string; index: number; hovered: number | null })
{
	const dimmed = hovered === null || hovered === index ? "opacity-100" : "opacity-50"

	return (
		<li
			className="group text-size-36 py-size-16 border-b border-b-foreground/10 cursor-pointer"
			{...rest}>
			<Link
				href={href}
				className={`flex justify-between items-center transition-opacity duration-300 ${dimmed}`}>
				<span>{children}</span>
				<ListItemArrow dimensions={32} fill="currentColor" />
			</Link>
		</li>
	)
}

const ListItemArrow = (
	{ dimensions, fill, className }:
	{ dimensions: number; fill: string; className?: string }
) => (
	<svg
		width={dimensions}
		height={dimensions}
		viewBox="0 0 20 20"
		fill={fill}
		xmlns="http://www.w3.org/2000/svg"
		className={`relative overflow-hidden ${className ?? ""}`}>
		<g className="[transform-box:view-box] -translate-x-[120%] animate-arrow-out group-hover:animate-arrow-in">
			<path d="M2 10.99V9.01003H6.82297L16.3923 9.57191L16.3158 9.78595L9.17065 3.07023L10.0383 2L18 9.54515V10.4549L10.0383 18L9.17065 16.9565L16.3158 10.2408L16.3923 10.4549L6.82297 10.99H2Z" />
		</g>
	</svg>
)
