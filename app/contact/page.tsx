import MainNav from "@/components/navigation/MainNav"
import Contact from "@/components/sections/Contact"
import PageReadySignal from "@/components/transition/PageReadySignal"

export default function ContactPage() {
	return (
		<main>
			<MainNav color="text-foreground" />
			<Contact />
			<PageReadySignal />
		</main>
	)
}
