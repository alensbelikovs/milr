import BodyLink from "@/components/buttons/BodyLink"
import PostGrid from "@/components/cards/PostGrid"
import Section from "@/components/layout/Section"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import Body36Secondary from "@/components/typography/Body36Secondary"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { type Post } from "@/types/CommonTypes"

const NAV_LABEL = "Latest Posts"

export default function FeaturedPosts({ posts }: { posts: Post[] }) {
	return (
		<Section className="py-size-96" label={NAV_LABEL}>
			<Body36Container className="mb-size-24">
				<Body36 serif={`( ${posts.length} )`}>Latest Posts</Body36>
			</Body36Container>
			<PostGrid posts={posts} />
			<Body36SecondaryContainer>
				<Body36Secondary>
					A mix of practical tips and creative ideas, taken from my social media feeds.
				</Body36Secondary>
				<BodyLink href="/diary">All Posts</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

FeaturedPosts.navLabel = NAV_LABEL
