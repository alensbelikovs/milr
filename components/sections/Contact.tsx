import ContactFormWrapper from "@/components/contact/ContactFormWrapper"
import Section from "@/components/layout/Section"

const NAV_LABEL = "Contact"

export default function Contact() {
	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<ContactFormWrapper />
		</Section>
	)
}

Contact.navLabel = NAV_LABEL
