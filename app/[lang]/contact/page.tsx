import PageReadySignal from "@/components/transition/PageReadySignal"
import Contact from "@/components/sections/Contact"
import MainNav from "@/components/navigation/MainNav"
import ContactIntro from "@/components/contact/ContactIntro"
import HeroList from "@/components/sections/HeroList"
import { getDictionary } from "@/lib/dictionaries"
import { alternates } from "@/lib/i18n"

export async function generateMetadata() {
	const dict = await getDictionary()
	return { title: dict.nav.contact, alternates: alternates("/contact") }
}

export default async function ContactPage() {
	const dict = await getDictionary()

	return (
		<main id="main">
			<MainNav color="text-foreground" />
			<Contact hero={<HeroList heading={dict.nav.contact}><ContactIntro /></HeroList>} />
			<PageReadySignal />
		</main>
	)
}
