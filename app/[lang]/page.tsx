import MainNav from "@/components/navigation/MainNav"
import SectionNavWrapper from "@/components/navigation/SectionNavWrapper"
import ContactCTA from "@/components/sections/ContactCTA"
import FeaturedPosts from "@/components/sections/FeaturedPosts"
import HeroCommon from "@/components/sections/HeroCommon"
import Introduction from "@/components/sections/Introduction"
import LatestWork from "@/components/sections/LatestWork"
import Process from "@/components/sections/Process"
import Testimonial from "@/components/sections/Testimonial"
import PageReadySignal from "@/components/transition/PageReadySignal"
import { getDictionary } from "@/lib/dictionaries"
import { alternates } from "@/lib/i18n"
import { getGeneralInformation, getLatestWork, getPosts, getRandomTestimonial } from "@/utils/sanityGetters"

const LATEST_WORK = 4
const FEATURED_POSTS = 4

export const metadata = { alternates: alternates("/") }

export default async function HomePage() {
	const [work, posts, testimonial, general, dict] = await Promise.all([
		getLatestWork({ limit: LATEST_WORK }),
		getPosts(FEATURED_POSTS),
		getRandomTestimonial(),
		getGeneralInformation(),
		getDictionary(),
	])

	// Empty sections are left out here, not inside them, so the section nav never links to a missing id
	return (
		<main className="relative">
			<MainNav color="text-background" />
			<HeroCommon
				heading="Rinalds Miļicins"
				subheading={dict.home.subheading}
				img={general?.img} />
			<SectionNavWrapper>
				<Introduction />
				{work.length > 0 && <LatestWork work={work} />}
				{testimonial && <Testimonial testimonial={testimonial} />}
				<Process />
				{posts.length > 0 && <FeaturedPosts posts={posts} />}
				<ContactCTA />
			</SectionNavWrapper>
			<PageReadySignal />
		</main>
	)
}
