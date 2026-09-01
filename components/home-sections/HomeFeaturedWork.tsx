import SectionHeading from "@/components/common/SectionHeading"
import CardGrid from "@/components/common/CardGrid"
import ProjectGridItem from "@/components/common/ProjectGridItem"
import { getProjects, getProjectsCount } from "@/utils/sanityGetters"
import LinkSecondary from "@/components/common/LinkSecondary"
import { GRID_CONTAINER, GRID_CYCLE_SPACER, PROJECT_VARIANTS } from "@/utils/gridVariants"

// How many projects the home grid features.
const FEATURED_LIMIT = 6

// The limit with a "+" while there is more work than the grid holds, the plain total once there
// is not. The projects array stops at the limit, so it cannot tell five projects from fifty.
const formatCount = (total: number) => total > FEATURED_LIMIT ? `${FEATURED_LIMIT}+` : `${total}`

export default async function HomeFeaturedWork() {
	const [projects, total] = await Promise.all([
		getProjects(FEATURED_LIMIT),
		getProjectsCount(),
	])

	if (projects.length === 0) return null

	return (
		<section className="pt-normal-3 px-regular bg-background relative z-1">
			<div className="grid grid-cols-15 gap-x-regular">
				<div className="col-span-full md:col-start-2 md:col-span-13">
					<SectionHeading sizeClassSerif="text-body-3" num={formatCount(total)}>My Favourite Work</SectionHeading>
				</div>
			</div>
			<CardGrid
				items={projects}
				variants={PROJECT_VARIANTS}
				className={GRID_CONTAINER}
				cycleSpacer={GRID_CYCLE_SPACER}
				getKey={project => project.slug}
				renderCard={(project, cardClassName) => (
					<ProjectGridItem project={project} className={cardClassName} />
				)} />
			<div className="flex items-center justify-center w-full col-span-full">
				<LinkSecondary href="/projects" target="_self">See More</LinkSecondary>
			</div>
		</section>
	)
}