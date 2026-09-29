import TextBlockReveal from "@/components/animation/TextBlockReveal"

// Rises as one block rather than a line at a time: at this size and in columns this long, a line-by-
// line entrance is a dozen small movements nobody can follow. The reveal brings its own wrapping div,
// which is the div this component always had — the DOM is the same as before it animated.
//
// instant passes straight through: it is the caller who knows whether this copy is worth waiting
// for, or is already on screen when the page arrives and should simply be there.
export default function Body18(
	{ children, instant = false, className }:
		{ children: React.ReactNode; instant?: boolean, className?: string }) {
	return (
		<TextBlockReveal className={`font-serif text-size-18 ${className ? className : ""}`} instant={instant}>
			{children}
		</TextBlockReveal>
	)
}
