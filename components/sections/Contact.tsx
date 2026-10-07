import ContactFormWrapper from "@/components/contact/ContactFormWrapper"
import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"

const NAV_ID: NavId = "contact"

export default function Contact() {
	return (
		<Section navId={NAV_ID}>
			<ContactFormWrapper />
		</Section>
	)
}

Contact.navId = NAV_ID
