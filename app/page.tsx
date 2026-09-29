import Introduction from "@/components/sections/Introduction"
import FeaturedWork from "@/components/sections/FeaturedWork"
import Testimonial from "@/components/sections/Testimonial"
import FeaturedPosts from "@/components/sections/FeaturedPosts"
import HeroCommon from "@/components/sections/HeroCommon"
import SectionNavWrapper from "@/components/navigation/SectionNavWrapper"
import Process from "@/components/sections/Process"
import ContactCTA from "@/components/sections/ContactCTA"
import PageReadySignal from "@/components/transition/PageReadySignal"
import MainNav from "@/components/navigation/MainNav"
import { getGeneralInformation, getPosts, getRandomTestimonial, getRandomWork } from "@/utils/sanityGetters"

// How many pieces the featured grid shows. Two full rows of the two-column grid.
const FEATURED_WORK = 4

// One row of the four-column post grid.
const FEATURED_POSTS = 4

export default async function HomePage() {
	// One Promise.all rather than three awaits, and gathered here rather than inside the sections
	// that use it. A section that fetches its own data cannot start until React reaches it in the
	// tree, so three such sections cost three round trips end to end; asked for together they cost
	// one. None of these depends on another, so there is nothing to serialise.
	const [work, posts, testimonial, general] = await Promise.all([
		getRandomWork({ limit: FEATURED_WORK }),
		getPosts(FEATURED_POSTS),
		getRandomTestimonial(),
		getGeneralInformation(),
	])

	return (
		<main className="relative">
			<MainNav color="text-background" />
			{/* The studio's own cover, from the general information singleton. Optional chaining
			    rather than a guard: the singleton is null only until someone saves it for the first
			    time, and the hero is a band with or without a picture in it. */}
			<HeroCommon
				heading="Rinalds Miļicins"
				subheading="Designing interiors for families and businesses"
				cover={general?.cover} />
			{/* Each section is rendered only where there is something to put in it: a heading over an
			    empty grid is a promise with nothing behind it. Decided here rather than inside the
			    sections because SectionNavWrapper reads navLabel off the ELEMENT — a section that
			    returned null for itself would still leave a link in the nav pointing at an id that was
			    never rendered. Children.toArray drops the false branches, so the nav lists exactly the
			    sections the page actually shows. */}
			<SectionNavWrapper>
				<Introduction />
				{work.length > 0 && <FeaturedWork work={work} />}
				{testimonial && <Testimonial testimonial={testimonial} />}
				<Process />
				{posts.length > 0 && <FeaturedPosts posts={posts} />}
				<ContactCTA />
			</SectionNavWrapper>
			<PageReadySignal />
		</main>
	)
}
