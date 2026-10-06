import TextLineSplit from "@/components/animation/TextLineSplit"
import HeadingSpanSerif from "@/components/typography/HeadingSpanSerif"

// The serif tag sits inside the split text so it rides along with its line
export default function Heading72(
	{ children, serif, className = "" }: {
		children: React.ReactNode,
		serif?: string,
		className?: string
	}) {
	return (
		<div className={`
			col-start-1 col-span-full
			md:col-start-2 md:col-span-10
			${className}
		`}>
			<TextLineSplit as="h3" className="text-size-96">
				{children}
				{serif && <HeadingSpanSerif>{serif}</HeadingSpanSerif>}
			</TextLineSplit>
		</div>
	)
}
