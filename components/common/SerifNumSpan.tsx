

// Inline rather than a block of its own, so it rides along with the text it counts and lands beside
// the last word wherever that word ends up. align-top pins its inline box to the top of the line
// box — the top edge of that word — which is where the flex layout's stretch used to put it, and
// gapClass carries the gap that used to come from the container.
//
// inline-BLOCK specifically, and that is what keeps an underline off it. text-decoration set on an
// ancestor propagates down and a descendant cannot switch it back off — no-underline on this span
// does nothing against a hover:underline on the link wrapping it. An atomic inline-level box is the
// exception the spec makes: decorations do not draw through one. So inside a link the count sits
// beside the underlined label without a line under its brackets, and everywhere else it lays out
// exactly as an inline span would, the content being too short to ever want a break inside it.
//
// gapClass rather than a fixed margin because the gap has to answer to the text it sits beside: one
// clamp next to text-heading-4 is a hairline, and the same clamp next to text-small is a gulf.
export default function SerifNumSpan(
	{ children, sizeClass, gapClass = "ml-small" }:
	{ children: React.ReactNode, sizeClass: string, gapClass?: string }
) {
	return (
		<span className={`inline-block align-top font-serif ${gapClass} ${sizeClass}`}>( {children} )</span>
	)
}
