import HeroSceneOverlay from "@/components/hero-scene/HeroSceneOverlay"
import HeroSceneCanvas from "@/components/hero-scene/HeroSceneCanvas"

// src is the cover the scene draws — passed down rather than fetched here, so this stays usable from
// any page and the caller decides which image its hero shows.
export default function HeroScene({ id, title, src }: { id: string, title: string, src: string }) {
	return (
		<section className="relative h-screen w-full">
			<HeroSceneOverlay title={title}/>
			<HeroSceneCanvas id={id} src={src}/>
		</section>
	)
}