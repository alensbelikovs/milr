import BodyLink from "@/components/buttons/BodyLink"
import Section from "@/components/layout/Section"
import Heading128 from "@/components/typography/Heading128"

const NAV_LABEL = "Contact"

export default function ContactCTA() {
	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<Heading128 className="mb-size-96">I would love to <br /> Hear Your ideas.</Heading128>
			<div className="col-span-full flex justify-center">
				<BodyLink href="/contact">Reach Out</BodyLink>
			</div>
		</Section>
	)
}

ContactCTA.navLabel = NAV_LABEL
