import ContactFormWrapper from "@/components/contact/ContactFormWrapper"
import { type NavId } from "@/components/navigation/SectionNavWrapper"

const NAV_ID: NavId = "contact"

// The hero is passed through, so the wrapper can hide it once the form has a result
export default function Contact({ hero }: { hero: React.ReactNode }) {
	return <ContactFormWrapper hero={hero} navId={NAV_ID} />
}

Contact.navId = NAV_ID
