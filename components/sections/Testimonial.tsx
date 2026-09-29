import Section from "@/components/layout/Section"
import Serif48 from "@/components/typography/Serif64"
import Serif64Footnote from "@/components/typography/Serif64Footnote"
import { type TestimonialType } from "@/types/ContentTypes"
import Body18Container from "@/components/typography/Body18Container"

const NAV_LABEL = "Client Stories"

// Required, with no stand-in behind it. A placeholder quote is an invented client saying invented
// things, and the moment the studio has none to show, saying nothing is the honest answer — which is
// the call the page makes by not rendering this at all.
export default function Testimonial(
	{ testimonial }:
		{ testimonial: TestimonialType }) {
	const { text, author, description } = testimonial

	return (
		<Section className="pt-size-192 pb-size-192" label={NAV_LABEL}>
			<Serif48>{text}</Serif48>
			<Serif64Footnote className="mt-size-96">— {author}, <br/> {description}</Serif64Footnote>
		</Section>
	)
}

// Read by SectionNavWrapper to build this section's nav link. Declared on the
// component so a page can compose sections without restating their names.
Testimonial.navLabel = NAV_LABEL
