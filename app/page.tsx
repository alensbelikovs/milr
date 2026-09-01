import AboutIntro from "@/components2/sections/AboutIntro"
import FeaturedProjects from "@/components2/sections/FeaturedProjects"
import Testimonials from "@/components2/sections/Testimonials"
import DesignProcess from "@/components2/sections/DesignProcess"
import FeaturedDiary from "@/components2/sections/FeaturedDiary"
import Contact from "@/components2/sections/Contact"

export default function HomePage() {
	return (
		<main className="flex flex-col gap-size-192">
			<div className="h-screen bg-zinc-200"/>
			<AboutIntro />
			<FeaturedProjects />
			<Testimonials />
			<DesignProcess />
			<FeaturedDiary />
			<Contact />
			<div className="h-screen"></div>
		</main>
	)
}
