import TextBlockReveal from "@/components/animation/TextBlockReveal"

export default function Body18({ children }: { children: React.ReactNode }) {
	return (
		<TextBlockReveal className="font-serif text-size-18">
			{children}
		</TextBlockReveal>
	)
}
