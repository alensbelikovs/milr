import TextLineReveal from "@/components2/typography/TextLineReveal"

// Gutter and side padding stay with the layout, as in BodyPrimary: forceSpacing sets how this sits
// among its neighbours, and dropping the grid's own rhythm is never what that means.
const LAYOUT_CLASS_NAME = "grid grid-cols-12 gap-size-24 px-size-24"
const DEFAULT_SPACING_CLASS_NAME = "pt-size-96"

export default function SectionEnd(
	{ children, link, forceSpacing }:
		{ children: React.ReactNode; link?: React.ReactNode; forceSpacing?: string })
{
	return (
		<div className={`${LAYOUT_CLASS_NAME} ${forceSpacing ?? DEFAULT_SPACING_CLASS_NAME}`}>
			{/* The gap between the text and the link belongs to this column rather than to the
			    section, so forceSpacing leaves it alone. */}
			<div className="flex flex-col col-start-7 col-span-3 gap-size-64">
				<TextLineReveal as="p" className="text-size-36">
					{ children }
				</TextLineReveal>
				{ link }
			</div>
		</div>
	)
}
