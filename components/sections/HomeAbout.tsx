import LinkSecondary from "@/components/navigation/LinkSecondary"
import TextLineSplit from "@/components/common/TextLineSplit"

export default function HomeAbout() {
	return (
		<section className="py-[144px] relative bg-background z-1 flex flex-col items-center w-full px-[12px] relative bg-background">
			<TextLineSplit 
				as="h2" 
				className="text-heading-2 max-w-5xl text-center"
			>
				I am an Interior Designer. I create unique spaces that serve your needs and feel true to who you are.
			</TextLineSplit>
			<div className="mt-[64px]">
				<LinkSecondary href="/about">About Me</LinkSecondary>
			</div>
		</section>
	)
}