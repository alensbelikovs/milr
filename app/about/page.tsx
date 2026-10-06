import MainNav from "@/components/navigation/MainNav"
import SectionNavWrapper from "@/components/navigation/SectionNavWrapper"
import ContactCTA from "@/components/sections/ContactCTA"
import FeaturedPosts from "@/components/sections/FeaturedPosts"
import HeroCommonAlt from "@/components/sections/HeroCommonAlt"
import Solutions from "@/components/sections/Solutions"
import Story from "@/components/sections/Story"
import PageReadySignal from "@/components/transition/PageReadySignal"
import { getPosts, getSolutions } from "@/utils/sanityGetters"

const FEATURED_POSTS = 4

export default async function AboutPage() {
	const [solutions, posts] = await Promise.all([getSolutions(), getPosts(FEATURED_POSTS)])

	return (
		<main>
			<MainNav color="text-foreground" />
			<HeroCommonAlt heading={<>I design spaces <br /> Shaped around You.</>} />
			<SectionNavWrapper>
				<Story />
				{solutions.length > 0 && <Solutions solutions={solutions} />}
				{posts.length > 0 && <FeaturedPosts posts={posts} />}
				<ContactCTA />
			</SectionNavWrapper>
			<PageReadySignal />
		</main>
	)
}
