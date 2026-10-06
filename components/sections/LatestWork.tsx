import BodyLink from "@/components/buttons/BodyLink"
import WorkGrid from "@/components/cards/WorkGrid"
import Section from "@/components/layout/Section"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import Body36Secondary from "@/components/typography/Body36Secondary"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { type WorkNarrow } from "@/types/WorkTypes"

const NAV_LABEL = "Latest Work"

// heading only changes the visible text; the section id always comes from NAV_LABEL
export default function LatestWork({ work, heading = NAV_LABEL }: { work: WorkNarrow[], heading?: string }) {
	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<Body36Container className="mb-size-24">
				<Body36 serif={`( ${work.length} + )`}>{heading}</Body36>
			</Body36Container>
			<WorkGrid work={work} />
			<Body36SecondaryContainer>
				<Body36Secondary>
					Every space is shaped around a real routine, built to feel as good as it functions.
				</Body36Secondary>
				<BodyLink href="/work">All Work</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

LatestWork.navLabel = NAV_LABEL
