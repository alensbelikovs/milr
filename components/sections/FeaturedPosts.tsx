import Section from "@/components/layout/Section"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import PostGrid from "@/components/cards/PostGrid"
import Body36Secondary from "@/components/typography/Body36Secondary"
import BodyLink from "@/components/buttons/BodyLink"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { type PostType } from "@/types/ContentTypes"

const NAV_LABEL = "Latest Posts"

// The posts are handed in rather than built here — see FeaturedWork for why a section on a page
// that fetches is a section the page cannot await alongside anything else.
export default function FeaturedPosts(
	{ posts }: { posts: PostType[] }) {
	return (
		<Section label={NAV_LABEL}>
			<Body36Container className="mb-size-24">
				<Body36 serif={`( ${posts.length} )`}>Latest Posts</Body36>
			</Body36Container>
			<PostGrid posts={posts} />
			<Body36SecondaryContainer>
				<Body36Secondary>
					{
						"A mix of practical tips and creative ideas,"
						+ " taken from my social media feeds."
					}
				</Body36Secondary>
				<BodyLink href="#">All Posts</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

// Read by SectionNavWrapper to build this section's nav link. Declared on the
// component so a page can compose sections without restating their names.
FeaturedPosts.navLabel = NAV_LABEL
