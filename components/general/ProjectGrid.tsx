import { type ProjectListType } from "@/types/ContentTypes"
import ProjectCard from "@/components/general/ProjectCard"

export default function ProjectGrid(
	{ projects }:
		{ projects: ProjectListType[] })
{
	return (
		<div className="col-start-2 col-span-10 grid grid-cols-2 gap-y-size-64 gap-x-size-24">
			{projects.map((project) => (
				<ProjectCard key={project.slug} project={project} />
			))}
		</div>
	)
}
