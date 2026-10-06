import TextMaskReveal from "@/components/animation/TextMaskReveal"
import Section from "@/components/layout/Section"
import HeadingSpanSerif from "@/components/typography/HeadingSpanSerif"

// Heading and item count for list pages; children go in the right-hand column (e.g. a filter button)
export default function HeroList(
	{ children, heading, count }: { children?: React.ReactNode, heading: string, count: number }) {
	return (
		<Section className="py-size-96 mt-size-96">
			<div className="
				col-start-1 col-span-full
				md:col-start-2 md:col-span-10
				lg:col-start-2 lg:col-span-5
			">
				<TextMaskReveal as="h1" className="text-size-128">
					{heading}
					{count > 0 && <HeadingSpanSerif>( {count} )</HeadingSpanSerif>}
				</TextMaskReveal>
			</div>
			<div className="
				col-start-1 col-span-full mt-size-48
				md:col-start-2 md:col-span-10
				lg:col-start-7 lg:col-span-5 lg:mt-0
				flex items-end justify-between
			">
				{children}
			</div>
		</Section>
	)
}
