import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import Body18 from "@/components/typography/Body18"
import Body18Container from "@/components/typography/Body18Container"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import { getDictionary } from "@/lib/dictionaries"

const NAV_ID: NavId = "my-story"

export default async function Story() {
	const { story } = (await getDictionary()).about

	return (
		<Section navId={NAV_ID}>
			<Body36Container>
				<Body36>{story.lead}</Body36>
			</Body36Container>
			<Body18Container>
				{story.paragraphs.map((paragraph, index) => <Body18 key={index}>{paragraph}</Body18>)}
			</Body18Container>
		</Section>
	)
}

Story.navId = NAV_ID
