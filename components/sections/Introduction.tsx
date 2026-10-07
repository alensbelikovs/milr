import BlockSlideInReveal from "@/components/animation/BlockSlideInReveal"
import BodyLink from "@/components/buttons/BodyLink"
import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import Body18 from "@/components/typography/Body18"
import Body18Container from "@/components/typography/Body18Container"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import { getDictionary } from "@/lib/dictionaries"

const NAV_ID: NavId = "intro"

export default async function Introduction() {
	const { intro } = (await getDictionary()).home

	return (
		<Section navId={NAV_ID}>
			<Body36Container>
				<Body36>{intro.lead}</Body36>
			</Body36Container>
			<Body18Container>
				{intro.paragraphs.map((paragraph, index) => <Body18 key={index}>{paragraph}</Body18>)}
				<BlockSlideInReveal as="div" className="w-full">
					<BodyLink className="w-full" href="/about">{intro.link}</BodyLink>
				</BlockSlideInReveal>
			</Body18Container>
		</Section>
	)
}

Introduction.navId = NAV_ID
