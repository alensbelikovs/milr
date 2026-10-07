import BlockSlideInReveal from "@/components/animation/BlockSlideInReveal"

// A serif paragraph; the optional heading rises in with it, so pass as="div" when using one.
// The heading resets the body's font and style, so className only shapes the body text.
export default function Body18(
	{ children, className = "", heading, as = "p" }: {
		children: React.ReactNode,
		className?: string,
		heading?: string,
		as?: keyof React.JSX.IntrinsicElements
	}) {
	return (
		<BlockSlideInReveal as={as} className={`font-serif text-size-18 ${className}`}>
			{heading && <h5 className="font-sans not-italic font-bold mb-size-24">{heading}</h5>}
			{children}
		</BlockSlideInReveal>
	)
}
