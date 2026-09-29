import PageReadySignal from "@/components/transition/PageReadySignal"
import HeroCommonAlt from "@/components/sections/HeroCommonAlt"
import SectionNavWrapper from "@/components/navigation/SectionNavWrapper"
import Story from "@/components/sections/Story"
import Services from "@/components/sections/Services"
import FeaturedPosts from "@/components/sections/FeaturedPosts"
import ContactCTA from "@/components/sections/ContactCTA"
import MainNav from "@/components/navigation/MainNav"
import { getPosts, getServices } from "@/utils/sanityGetters"

// One row of the four-column post grid.
const FEATURED_POSTS = 4

export default async function AboutPage() {
	// Together rather than one after the other: neither depends on the other, so serialising them
	// would spend a second round trip for nothing. See the home page.
	const [services, posts] = await Promise.all([
		getServices(),
		getPosts(FEATURED_POSTS),
	])

	return (
		<main>
			<MainNav color="text-foreground" />
			<HeroCommonAlt heading={<>I design spaces <br /> Shaped around You.</>} />
			<SectionNavWrapper>
				<Story />
				{services.length > 0 && <Services services={services} />}
				{posts.length > 0 && <FeaturedPosts posts={posts} />}
				<ContactCTA />
			</SectionNavWrapper>
			<PageReadySignal />
		</main>
	)
}
