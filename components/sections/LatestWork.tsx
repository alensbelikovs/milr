import BodyLink from "@/components/buttons/BodyLink"
import WorkGrid from "@/components/cards/WorkGrid"
import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import Body36Secondary from "@/components/typography/Body36Secondary"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { getDictionary } from "@/lib/dictionaries"
import { type WorkNarrow } from "@/types/WorkTypes"

const NAV_ID: NavId = "latest-work"

// heading only changes the visible text; the section id always comes from NAV_ID
export default async function LatestWork({ work, heading }: { work: WorkNarrow[], heading?: string }) {
	const dict = await getDictionary()

	return (
		<Section navId={NAV_ID}>
			<Body36Container className="mb-size-24">
				<Body36 serif={`( ${work.length} + )`}>{heading ?? dict.sections[NAV_ID]}</Body36>
			</Body36Container>
			<WorkGrid work={work} />
			<Body36SecondaryContainer>
				<Body36Secondary>{dict.home.latestWork.text}</Body36Secondary>
				<BodyLink href="/work">{dict.home.latestWork.link}</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

LatestWork.navId = NAV_ID
