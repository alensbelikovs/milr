import Section from "@/components/general/Section"
import Serif48 from "@/components/typography/Serif64"
import Body16Secondary from "@/components/typography/Body16Secondary"
import Pagination from "@/components/actions/Pagination"

const NAV_LABEL = "Client Stories"

export default function Testimonial() {
	return (
		<Section label={NAV_LABEL}>
			<Serif48>We came in with a hundred Pinterest boards and no idea how any of it would actually fit our apartment. Rinalds asked more questions about our morning routine than our style, which felt strange at first, but it made all the difference. Somehow the result feels exactly like us, not like any of those.</Serif48>
			<Body16Secondary className="mt-size-48">— Kārlis and Marta, <br/> reflecting on their home redesign</Body16Secondary>
		</Section>
	)
}

// Read by SectionNavWrapper to build this section's nav link. Declared on the
// component so a page can compose sections without restating their names.
Testimonial.navLabel = NAV_LABEL
