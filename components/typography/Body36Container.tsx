import { ReactNode } from "react"

export default function Body36Container(
	{ children, className = "" }:
		{ children: ReactNode; className?: string })
{
	return (
		<div
			className={`
				col-start-1 col-span-12
				sm:col-start-1 sm:col-span-9
				md:col-start-2 md:col-span-7
				lg:col-start-2 lg:col-span-5
				flex flex-col gap-size-64
				${className}`}>
			{ children }
		</div>
	)
}
