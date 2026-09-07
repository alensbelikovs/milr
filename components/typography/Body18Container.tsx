import { ReactNode } from "react"

export default function Body18Container(
	{ children, className }:
		{ children: ReactNode; className?: string })
{
	return (
		<div
			className={`
				col-start-7 col-span-3 row-start-2
				flex flex-col gap-size-48 mt-size-144
				${className}`}>
			{ children }
		</div>
	)
}
