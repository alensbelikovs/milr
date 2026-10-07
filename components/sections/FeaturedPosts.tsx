import BodyLink from "@/components/buttons/BodyLink"
import PostGrid from "@/components/cards/PostGrid"
import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import Body36Secondary from "@/components/typography/Body36Secondary"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { getDictionary } from "@/lib/dictionaries"
import { type Post } from "@/types/CommonTypes"

const NAV_ID: NavId = "latest-posts"

export default async function FeaturedPosts({ posts }: { posts: Post[] }) {
	const dict = await getDictionary()

	return (
		<Section navId={NAV_ID}>
			<Body36Container className="mb-size-24">
				<Body36 serif={`( ${posts.length} )`}>{dict.sections[NAV_ID]}</Body36>
			</Body36Container>
			<PostGrid posts={posts} />
			<Body36SecondaryContainer>
				<Body36Secondary>{dict.home.featuredPosts.text}</Body36Secondary>
				<BodyLink href="/diary">{dict.home.featuredPosts.link}</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

FeaturedPosts.navId = NAV_ID
