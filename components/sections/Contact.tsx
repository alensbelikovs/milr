import Section from "@/components/general/Section"
import Heading128 from "@/components/typography/Heading128"
import ContactFormWrapper from "@/components/actions/ContactFormWrapper"


const NAV_LABEL = "Contact"

export default function Contact() {
	return (
		<Section label={NAV_LABEL}>
			<Heading128 className="mb-size-144">I would love to <br /> Hear Your ideas.</Heading128>
			{/* The wrapper is the client boundary and picks between the form, the success and
			    the error state. This section stays a server component so it keeps its nav link. */}
			<ContactFormWrapper home />
		</Section>
	)
}

Contact.navLabel = NAV_LABEL
