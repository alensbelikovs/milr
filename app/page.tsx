import PageReadySignal from "@/components/transition/PageReadySignal"
import HomeAbout from "@/components/home/HomeAbout"
import HomeFeaturedWork from "@/components/home/HomeFeaturedWork"
import CommonHeroScene from "@/components/hero-scene/HeroScene"
import Footer from "@/components/layout/Footer"
import HomeProcess from "@/components/home/HomeProcess"
import HomeFeaturedBlogs from "@/components/home/HomeFeaturedBlogs"


export default function HomePage() {
	return (
		<>
			<CommonHeroScene id="home-hero" title="Rinalds Miļicins" src="/placeholder.png"/>
			<HomeAbout />
			<HomeFeaturedWork />
			<HomeProcess />
			<HomeFeaturedBlogs />
			{/* <Footer /> */}
			<PageReadySignal />
		</>
	)
}
