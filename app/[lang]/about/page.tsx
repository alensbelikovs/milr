import MainNav from "@/components/navigation/MainNav"
import SectionNavWrapper from "@/components/navigation/SectionNavWrapper"
import ContactCTA from "@/components/sections/ContactCTA"
import FeaturedPosts from "@/components/sections/FeaturedPosts"
import HeroCommonAlt from "@/components/sections/HeroCommonAlt"
import Solutions from "@/components/sections/Solutions"
import Story from "@/components/sections/Story"
import PageReadySignal from "@/components/transition/PageReadySignal"
import Lines from "@/components/typography/Lines"
import { getDictionary } from "@/lib/dictionaries"
import { alternates } from "@/lib/i18n"
import { getPosts, getSolutions } from "@/utils/sanityGetters"

const FEATURED_POSTS = 4

export async function generateMetadata() {
	const dict = await getDictionary()
	return { title: dict.nav.about, alternates: alternates("/about") }
}

export default async function AboutPage() {
	const [solutions, posts, dict] = await Promise.all([getSolutions(), getPosts(FEATURED_POSTS), getDictionary()])

	return (
		<main>
			<MainNav color="text-foreground" />
			<HeroCommonAlt heading={<Lines lines={dict.about.heading} />} />
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
