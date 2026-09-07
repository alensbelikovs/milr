import type { ReactNode } from "react"

export default function List(
	{ children, className = "col-start-2 col-span-5" }:
	{ children: ReactNode; className?: string })
{
	return (
		<ul className={className}>
			{children}
		</ul>
	)
}
