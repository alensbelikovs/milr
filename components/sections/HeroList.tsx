import TextMaskReveal from "@/components/animation/TextMaskReveal"
import Section from "@/components/layout/Section"
import HeadingSpanSerif from "@/components/typography/HeadingSpanSerif"

// Page heading with an optional count. Children (filters, an intro) place themselves in the grid;
// without them the heading spans all but the outer columns, from md like the heading beside children.
export default function HeroList(
	{ children, heading, count }: { children?: React.ReactNode, heading: string, count?: number }) {
	return (
		<Section className="mt-size-96">
			<div className={children
				? `
					col-start-1 col-span-full
					md:col-start-2 md:col-span-10
					lg:col-start-2 lg:col-span-5
				`
				: "col-start-1 col-span-full md:col-start-2 md:col-span-10"}>
				<TextMaskReveal as="h1" className="text-size-128">
					{heading}
					{count !== undefined && count > 0 && <HeadingSpanSerif>( {count} )</HeadingSpanSerif>}
				</TextMaskReveal>
			</div>
			{children}
		</Section>
	)
}
