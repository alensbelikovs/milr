import { type ReactNode } from "react"
import Section from "@/components/layout/Section"
import Heading128 from "@/components/typography/Heading128"
import ContactFormWrapper from "@/components/contact/ContactFormWrapper"
import BodyLink from "@/components/buttons/BodyLink"


const NAV_LABEL = "Contact"

// ReactNode rather than string so callers can break the line themselves with <br />.
export default function Contact(
	{ heading = <>I would love to <br /> Hear Your ideas.</> }:
		{ heading?: ReactNode }) {
	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<Heading128 className="mb-size-96">{heading}</Heading128>
			<div className="col-span-full flex justify-center">
				<BodyLink href="/contact">Reach Out</BodyLink>
			</div>
		</Section>
	)
}

Contact.navLabel = NAV_LABEL
