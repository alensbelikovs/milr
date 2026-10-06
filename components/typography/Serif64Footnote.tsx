import TextLineSplit from "@/components/animation/TextLineSplit"

export default function Serif64Footnote(
	{ children, className = "" }: { children: React.ReactNode, className?: string }) {
	return (
		<div className="
			col-start-7 col-span-5
			lg:col-start-7 lg:col-span-3
		">
			<TextLineSplit className={`text-size-18 ${className}`}>
				{children}
			</TextLineSplit>
		</div>
	)
}
