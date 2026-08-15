import PageReadySignal from "@/components/transition/PageReadySignal"
import HeroSceneOverlay from "@/components/hero/HeroSceneOverlay"
import HeroSceneCanvas from "@/components/hero/HeroSceneCanvas"


export default function HomePage() {
	return (
		<>
			<section className="relative h-screen w-full">
				<HeroSceneOverlay heading="Rinalds Miļicins"/>
				<HeroSceneCanvas />
			</section>
			<PageReadySignal />
		</>
	)
}
