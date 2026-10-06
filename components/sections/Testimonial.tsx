import Section from "@/components/layout/Section"
import Serif64 from "@/components/typography/Serif64"
import Serif64Footnote from "@/components/typography/Serif64Footnote"
import { type Testimonial as TestimonialType } from "@/types/CommonTypes"

const NAV_LABEL = "Client Stories"

export default function Testimonial({ testimonial }: { testimonial: TestimonialType }) {
	const { text, author, description } = testimonial

	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<Serif64>{text}</Serif64>
			<Serif64Footnote className="mt-size-96">— {author}, <br /> {description}</Serif64Footnote>
		</Section>
	)
}

Testimonial.navLabel = NAV_LABEL
