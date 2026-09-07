import Section from "@/components/general/Section"
import Body36 from "@/components/typography/Body36"
import PostGrid from "@/components/general/PostGrid"
import Body36Secondary from "@/components/typography/Body36Secondary"
import BodyLink from "@/components/actions/BodyLink"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { type PostType } from "@/types/ContentTypes"

const NAV_LABEL = "Latest Posts"

export default function FeaturedPosts() {
	const postsTemp: PostType[] = [
		{
			title: "Three questions I ask before drawing anything",
			media: null,
			_createdAt: new Date(),
			externalUrl: "/"
		},
		{
			title: "Why the hallway is the room worth fighting for",
			media: null,
			_createdAt: new Date(),
			externalUrl: "/"
		},
		{
			title: "Choosing a floor you will still like in ten years",
			media: null,
			_createdAt: new Date(),
			externalUrl: "/"
		},
		{
			title: "Light does more of the work than colour does",
			media: null,
			_createdAt: new Date(),
			externalUrl: "/"
		},
	]
	return (
		<Section label={NAV_LABEL}>
			<Body36 className="mb-size-24" serif="( 4 + )">Latest Posts</Body36>
			<PostGrid posts={postsTemp} />
			<Body36SecondaryContainer>
				<Body36Secondary>
					{
						"A mix of practical tips and creative ideas,"
						+ " taken from my social media feeds."
					}
				</Body36Secondary>
				<BodyLink href="#">See More Posts</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

// Read by SectionNavWrapper to build this section's nav link. Declared on the
// component so a page can compose sections without restating their names.
FeaturedPosts.navLabel = NAV_LABEL
