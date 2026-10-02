import PageReadySignal from "@/components/transition/PageReadySignal"
import HeroCommonAlt from "@/components/sections/HeroCommonAlt"
import SectionNavWrapper from "@/components/navigation/SectionNavWrapper"
import Story from "@/components/sections/Story"
import Services from "@/components/sections/Services"
import FeaturedPosts from "@/components/sections/FeaturedPosts"
import ContactCTA from "@/components/sections/ContactCTA"
import MainNav from "@/components/navigation/MainNav"
import { getPosts, getServices } from "@/utils/sanityGetters"

export default async function AboutPage() {
	const [services, posts] = await Promise.all([
		getServices(),
		getPosts(4),
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
