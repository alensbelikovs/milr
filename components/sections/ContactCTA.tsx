import BodyLink from "@/components/buttons/BodyLink"
import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import Heading128 from "@/components/typography/Heading128"
import Lines from "@/components/typography/Lines"
import { getDictionary } from "@/lib/dictionaries"

const NAV_ID: NavId = "contact"

export default async function ContactCTA() {
	const { home } = await getDictionary()

	return (
		<Section navId={NAV_ID}>
			<Heading128 className="mb-size-96"><Lines lines={home.contactCta.heading} /></Heading128>
			<div className="col-span-full flex justify-center">
				<BodyLink href="/contact">{home.contactCta.link}</BodyLink>
			</div>
		</Section>
	)
}

ContactCTA.navId = NAV_ID
