import MaskReveal from "@/components2/animation/MaskReveal"

// Gutter and side padding stay with the layout, as in BodyPrimary: forceSpacing sets how this sits
// among its neighbours, and dropping the grid's own rhythm is never what that means.
const LAYOUT_CLASS_NAME = "w-full grid grid-cols-12 gap-size-24 px-size-24"
const DEFAULT_SPACING_CLASS_NAME = "py-size-24"

export default function SectionTitle(
	{ chapter, title, forceSpacing }:
		{ chapter: string; title: string; forceSpacing?: string })
{
	return (
		<div className={`${LAYOUT_CLASS_NAME} ${forceSpacing ?? DEFAULT_SPACING_CLASS_NAME}`}>
			<div className="col-start-7 col-span-5 flex items-center gap-size-24">
				{/* The flex row is this wrapper rather than MaskReveal's own tag: MaskReveal puts the
				    children inside a span of its own, so a gap set on the tag has only that one span
				    to space out and the two below never see it. inline-flex, because the span it
				    sits in is inline-block and the row has no reason to be wider than its text. */}
				<MaskReveal as="p">
					<span className="inline-flex items-center gap-size-24">
						<span className="text-foreground/50 font-serif text-size-18">Chapter {chapter}</span>
						<span className="text-size-16 mt-0.75">{title}</span>
					</span>
				</MaskReveal>
			</div>
		</div>
	)
}
