import BodyLink from "@/components/buttons/BodyLink"
import Section from "@/components/layout/Section"
import MainNav from "@/components/navigation/MainNav"
import PageReadySignal from "@/components/transition/PageReadySignal"
import Heading128 from "@/components/typography/Heading128"
import { getDictionary } from "@/lib/dictionaries"

// Laid out like the contact form's FormSuccess and FormError
export default async function NotFound() {
	const dict = await getDictionary()

	return (
		<main id="main">
			<MainNav color="text-foreground" />
			<Section noTopPadding className="mt-size-96">
				<Heading128 mainHeading className="mb-size-192 mt-size-96">{dict.notFound.heading}</Heading128>
				<div className="col-span-full flex flex-col items-center text-center gap-size-96">
					<BodyLink href="/" delay={0.1}>{dict.notFound.link}</BodyLink>
				</div>
			</Section>
			<PageReadySignal />
		</main>
	)
}
