import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import Serif64 from "@/components/typography/Serif64"
import Serif64Footnote from "@/components/typography/Serif64Footnote"
import { type Testimonial as TestimonialType } from "@/types/CommonTypes"

const NAV_ID: NavId = "client-stories"

export default function Testimonial({ testimonial }: { testimonial: TestimonialType }) {
	const { text, author, description } = testimonial

	return (
		<Section navId={NAV_ID}>
			<Serif64>{text}</Serif64>
			<Serif64Footnote className="mt-size-96">— {author}, <br /> {description}</Serif64Footnote>
		</Section>
	)
}

Testimonial.navId = NAV_ID
