import PageReadySignal from "@/components/transition/PageReadySignal"
import HomeAbout from "@/components/sections/HomeAbout"
import HomeFeaturedWork from "@/components/sections/HomeFeaturedWork"
import CommonHeroScene from "@/components/sections/CommonHeroScene"
import CommonTestimonial from "@/components/sections/CommonTestimonial"
import Footer from "@/components/sections/Footer"


export default function HomePage() {
	return (
		<>
			<CommonHeroScene id="home-hero" title="Rinalds Miļicins"/>
			<HomeAbout />
			<HomeFeaturedWork />
			<CommonTestimonial />
			<Footer />
			<PageReadySignal />
		</>
	)
}
