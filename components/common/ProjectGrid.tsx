import LinkProject from "@/components/common/LinkProject"

type Project = {
	title: string
	img: string
	slug: string
}

type ProjectGridProps = {
	projects?: Project[]
}

const TEMP_PROJECTS: Project[] = [
	{
		title: "MR-001",
		img: "/placeholder.png",
		slug: "/projects/mr-001"
	},
	{
		title: "MR-002",
		img: "/placeholder.png",
		slug: "/projects/mr-002"
	},
	{
		title: "MR-003",
		img: "/placeholder.png",
		slug: "/projects/mr-003"
	},
	{
		title: "MR-004",
		img: "/placeholder.png",
		slug: "/projects/mr-004"
	},
	{
		title: "MR-005",
		img: "/placeholder.png",
		slug: "/projects/mr-005"
	},
	{
		title: "MR-006",
		img: "/placeholder.png",
		slug: "/projects/mr-006"
	}
]

// Applied in order and wrapped once exhausted, so any number of projects keeps
// the same rhythm. Written as whole class strings so Tailwind can find them.
const PROJECT_VARIANTS = [
	"col-start-1 col-span-7 aspect-16/10",
	"col-start-9 col-span-7 mt-[144px] aspect-16/10",
	"col-start-3 col-span-11 aspect-16/10",
	"col-start-1 col-span-4 mt-[144px] aspect-10/16",
	"col-start-9 col-span-7 aspect-16/10",
	"col-start-3 col-span-11 aspect-16/10",
]

export default function ProjectGrid({ projects = TEMP_PROJECTS }: ProjectGridProps) {
	return (
		<div className="grid grid-cols-15 gap-x-[24px] gap-y-[144px]">
			{projects.map((project, index) => (
				<LinkProject
					key={project.slug}
					title={project.title}
					img={project.img}
					slug={project.slug}
					className={PROJECT_VARIANTS[index % PROJECT_VARIANTS.length]} />
			))}
		</div>
	)
}
