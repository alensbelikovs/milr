import { Children } from "react"
import TextMaskReveal from "@/components/animation/TextMaskReveal"

// One fact: label on the left, values on the right, each revealing out of its own mask
export default function DetailTableRow({ children, label }: { children: React.ReactNode, label: string }) {
	return (
		<div className="
			flex justify-between items-end gap-size-48
			py-size-16 border-b border-foreground/10
		">
			<TextMaskReveal as="h5" className="self-start font-serif text-size-18 opacity-50">
				{label}
			</TextMaskReveal>
			<div className="flex flex-wrap max-w-1/2 justify-end gap-size-16 text-size-16 text-right">
				{Children.toArray(children).map((value, index) => (
					// Padding on the rising span keeps underlines inside the mask
					<TextMaskReveal key={index} className="*:pb-[0.3em]">{value}</TextMaskReveal>
				))}
			</div>
		</div>
	)
}
