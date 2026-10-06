import Section from "@/components/layout/Section"
import SolutionsList from "@/components/lists/SolutionsList"
import Heading72 from "@/components/typography/Heading72"
import { type Solution } from "@/types/CommonTypes"

const NAV_LABEL = "Solutions"

export default function Solutions({ solutions }: { solutions: Solution[] }) {
	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<Heading72 serif={`( ${solutions.length} )`} className="mb-size-96">Solutions</Heading72>
			<SolutionsList solutions={solutions} />
		</Section>
	)
}

Solutions.navLabel = NAV_LABEL
