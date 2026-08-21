import PageReadySignal from "@/components/transition/PageReadySignal"
import HeroScene from "@/components/hero-scene/HeroScene"
import { getProject } from "@/utils/sanityGetters"
import buildImageUrl, { HERO } from "@/utils/buildImageUrl"
import { notFound } from "next/navigation"

export default async function ProjectShow({ params }: PageProps<"/projects/[projectSlug]">) {
	const { projectSlug } = await params
	const project = await getProject(projectSlug)

	// No such slug hands over to not-found.tsx, which signals page ready itself so the curtain still
	// lifts. Throwing to global-error instead would replace the root layout — curtain, navbar and all —
	// leaving nothing mounted to resolve the transition.
	if (!project) notFound()

	return (
		<>
			<HeroScene
				id="project-show-hero"
				title={project.title}
				src={buildImageUrl(project.img, HERO)} />
			<PageReadySignal />
		</>
	)
}
