import type { ProjectShowType } from "@/types/ContentTypes"

export default function ProjectAbout({ project }: { project: ProjectShowType }) {

	const { description, year, location, category } = project
	console.log(project)

	return (
		<section className="
			py-section bg-background relative z-1
			grid grid-cols-12 gap-regular px-regular
		"
		>
			<div className="col-start-2 col-span-5 flex gap-normal-2">
				<div className="flex flex-col gap-micro font-serif text-foreground/50">
					<p>Type</p>
					<p>Location</p>
					<p>Year</p>
				</div>
				<div className="flex flex-col gap-micro">
					<p>{category}</p>
					<p>{location}</p>
					<p>{year!.slice(0,4)}</p>
				</div>
			</div>
			{
				description && 
				<div className="col-start-8 col-span-4">
					<p className="font-serif text-body-2">{description}</p>
				</div>
			}
		</section>
	)
}