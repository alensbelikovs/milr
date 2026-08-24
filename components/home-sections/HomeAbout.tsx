import LinkSecondary from "@/components/common/LinkSecondary"
import LinkPrimary from "@/components/common/LinkPrimary"
import TextLineSplit from "@/components/common/TextLineSplit"

export default function HomeAbout() {
	return (
		<section 
		className="
			py-normal-3 bg-background relative z-1
			grid grid-cols-12 
			gap-regular px-regular
		"
		>
			<div 
			className="
				col-span-11
				md:col-span-9 md:col-start-2
				lg:col-span-6 xl:col-span-5 lg:col-start-2 xl:col-start-2
			"
			>
				<TextLineSplit as="p" className="text-subheading">
					{
						"I am an interior designer creating practical and memorable " 
						+ "interiors that compliment routines and stay " 
						+ "useful for years to come."
					}
				</TextLineSplit>
			</div>
		</section>
	)
}