import HeroSceneOverlay from "@/components/hero/HeroSceneOverlay"
import HeroSceneCanvas from "@/components/hero/HeroSceneCanvas"

export default function HeroScene({ id, title }: { id: string, title: string }) {
	return (
		<section className="relative h-screen w-full">
			<HeroSceneOverlay title={title}/>
			<HeroSceneCanvas id={id}/>
		</section>
	)
}