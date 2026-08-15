import LinkPrimary from "@/components/navigation/LinkPrimary"
import LinkSecondary from "@/components/navigation/LinkSecondary"

export default function Navbar() {
	return (
		<header className="fixed top-0 left-0 z-10 w-full">
			<nav className="p-[16px] flex w-full items-center justify-between gap-[24px]">
				<div className="flex gap-[12px]">
					<LinkPrimary href="/">Home</LinkPrimary>
					<LinkPrimary href="/projects">Projects</LinkPrimary>
					<LinkPrimary href="/about">About</LinkPrimary>
					<LinkPrimary href="/video-blog">Video Blog</LinkPrimary>
				</div>
				<div className="flex gap-[12px]">
					<LinkPrimary href="/contact">Contact</LinkPrimary>
				</div>
			</nav>
		</header>
	)
}
