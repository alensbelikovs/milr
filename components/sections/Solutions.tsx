import Section from "@/components/layout/Section"
import SolutionsList from "@/components/lists/SolutionsList"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import Heading72 from "@/components/typography/Heading72"
import { getDictionary } from "@/lib/dictionaries"
import { type Solution } from "@/types/CommonTypes"

const NAV_ID: NavId = "solutions"

export default async function Solutions({ solutions }: { solutions: Solution[] }) {
	const dict = await getDictionary()

	return (
		<Section navId={NAV_ID}>
			<Heading72 serif={`( ${solutions.length} )`} className="mb-size-96">
				{dict.sections[NAV_ID]}
			</Heading72>
			<SolutionsList solutions={solutions} />
		</Section>
	)
}

Solutions.navId = NAV_ID
