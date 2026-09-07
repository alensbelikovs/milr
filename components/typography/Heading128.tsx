import { type ReactNode } from "react"

export default function Heading128(
	{ children, mainHeading, className }:
		{ children: ReactNode; mainHeading?: boolean, className?: string }) {
	return (
		<div className="col-span-full text-center">
			{
				mainHeading ?
					<h1 className={`text-size-128 ${className}`}>
						{children}
					</h1> :
					<h2 className={`text-size-128 ${className}`}>
						{children}
					</h2>
			}
		</div>
	)
}
