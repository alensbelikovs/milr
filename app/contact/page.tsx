import PageReadySignal from "@/components/transition/PageReadySignal"
import Contact from "@/components/sections/Contact"
import MainNav from "@/components/navigation/MainNav"

export default function ContactPage() {
	return (
		<div>
			<MainNav color="text-foreground" />
			<Contact />
			<PageReadySignal />
		</div>
	)
}
