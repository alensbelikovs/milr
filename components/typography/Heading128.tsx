import TextLineSplit from "@/components/animation/TextLineSplit"

export default function Heading128(
	{ children, mainHeading = false, className = "", delay }: {
		children: React.ReactNode,
		mainHeading?: boolean,
		className?: string,
		delay?: number
	}) {
	return (
		<div className="col-span-full text-center">
			<TextLineSplit
				as={mainHeading ? "h1" : "h2"}
				className={`text-size-128 ${className}`}
				delay={delay}>
				{children}
			</TextLineSplit>
		</div>
	)
}
