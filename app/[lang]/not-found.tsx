import MainNav from "@/components/navigation/MainNav"
import { getDictionary } from "@/lib/dictionaries"

export default async function NotFound() {
	const dict = await getDictionary()

	return (
		<main className="min-h-screen grid grid-cols-12 gap-6 px-6 pt-[35vh]">
			<MainNav color="text-foreground" />
			<h1 className="col-start-2 col-span-10 text-heading-2">{dict.notFound.heading}</h1>
			<p className="col-start-2 col-span-6 text-body-2">{dict.notFound.text}</p>
		</main>
	)
}
