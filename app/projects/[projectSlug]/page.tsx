import PageReadySignal from "@/components/transition/PageReadySignal"
import HeroScene from "@/components/sections/CommonHeroScene"

export default function ProjectShow() {
	return (
		<>
			<HeroScene id="project-show-hero" title="MR-001"/>
			<PageReadySignal />
		</>
	)
}