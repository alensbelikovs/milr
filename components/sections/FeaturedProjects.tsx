import Section from "@/components/general/Section"
import Body36 from "@/components/typography/Body36"
import ProjectGrid from "@/components/general/ProjectGrid"
import Body36Secondary from "@/components/typography/Body36Secondary"
import BodyLink from "@/components/actions/BodyLink"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { type ProjectListType } from "@/types/ContentTypes"

const NAV_LABEL = "Best Work"

export default function FeaturedProjects() {
	const projectsTemp: ProjectListType[] = [
		{
			title: "MR-001",
			slug: "mr-001",
			media: null,
			type: "Concept",
			category: "Residential",
		},
		{
			title: "MR-002",
			slug: "mr-002",
			media: null,
			type: "Concept",
			category: "Commercial",
		},
		{
			title: "MR-003",
			slug: "mr-003",
			media: null,
			type: "Project",
			category: "Residential",
		},
		{
			title: "MR-004",
			slug: "mr-004",
			media: null,
			type: "Project",
			category: "Residential",
		},
	]
	return (
		<Section label={NAV_LABEL}>
			<Body36 className="mb-size-24" serif="( 4 + )">Best Work</Body36>
			<ProjectGrid projects={projectsTemp} />
			<Body36SecondaryContainer>
				<Body36Secondary>
					{
						"Every space is shaped around a real routine,"
						+ " built to feel as good as it functions."
					}
				</Body36Secondary>
				<BodyLink href="#">See More Work</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

// Read by SectionNavWrapper to build this section's nav link. Declared on the
// component so a page can compose sections without restating their names.
FeaturedProjects.navLabel = NAV_LABEL
