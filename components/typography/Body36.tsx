import TextLineSplit from "@/components/animation/TextLineSplit"
import BodySpanSerif from "@/components/typography/BodySpanSerif"

// The serif tag sits inside the split text so it rides along with its line
export default function Body36({ children, serif }: { children: React.ReactNode, serif?: string }) {
	return (
		<div>
			<TextLineSplit className="text-size-36">
				{children}
				{serif && <BodySpanSerif>{serif}</BodySpanSerif>}
			</TextLineSplit>
		</div>
	)
}
