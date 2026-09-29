import { type ReactNode } from "react"
import Section from "@/components/layout/Section"
import ContactFormWrapper from "@/components/contact/ContactFormWrapper"


const NAV_LABEL = "Contact"

// ReactNode rather than string so callers can break the line themselves with <br />.
//
// The heading is handed to the wrapper rather than rendered here, because sending the message
// changes it: "I would love to hear your ideas" becomes "Thank You!" or "Oops!". The wrapper holds
// both it and the form so the pair can fade out and come back as one block — see there.
export default function Contact(
	{ heading = <>I would love to <br /> Hear Your ideas.</> }:
		{ heading?: ReactNode }) {
	return (
		<Section label={NAV_LABEL}>
			<ContactFormWrapper heading={heading} />
		</Section>
	)
}

Contact.navLabel = NAV_LABEL
