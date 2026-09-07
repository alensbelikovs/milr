import Introduction from "@/components/sections/Introduction"
import FeaturedProjects from "@/components/sections/FeaturedProjects"
import Testimonial from "@/components/sections/Testimonial"
import FeaturedPosts from "@/components/sections/FeaturedPosts"
import HeroCommon from "@/components/sections/HeroCommon"
import SectionNavWrapper from "@/components/actions/SectionNavWrapper"
import Process from "@/components/sections/Process"
import Contact from "@/components/sections/Contact"
import PageReadySignal from "@/components/general/PageReadySignal"


export default function HomePage() {
	return (
		<main className="relative">
			<HeroCommon
				heading="Rinalds Miļicins"
				subheading="Designing interiors for families and businesses" />
			<SectionNavWrapper>
				<Introduction />
				<FeaturedProjects />
				<Testimonial />
				<Process />
				<FeaturedPosts />
				<Contact />
			</SectionNavWrapper>
			<PageReadySignal />
		</main>
	)
}
