import LinkPrimary from "@/components/navigation/LinkPrimary"
import LinkSecondary from "@/components/navigation/LinkSecondary"
import FooterGroup from "@/components/common/FooterGroup"

export default function Footer({ heading="Ready when You are." }: { heading?: string }) {
	return (
		<div className="relative h-[200vh] -mt-[100vh]">
			<footer className="sticky flex flex-col min-h-screen top-0 left-0 pt-[144px] px-[24px] w-full bg-foreground text-background">
				<div className="w-full flex flex-col items-center">
					<h2 className="text-heading-3 text-center">{ heading }</h2>
					<div className="mt-[64px]">
						<LinkSecondary href="/contact">Reach Out</LinkSecondary>
					</div>
				</div>
				<div className="flex justify-between w-full mt-[216px] text-body-1">
					<div>
						<p className="leading-tight">Rinalds Miļicins</p>
						<p className="text-background/50 leading-tight">Interior Designer</p>
					</div>
					<FooterGroup title="Navigation">
						<LinkPrimary href="/contact">Home</LinkPrimary>
						<LinkPrimary href="/contact">Projects</LinkPrimary>
						<LinkPrimary href="/contact">About</LinkPrimary>
						<LinkPrimary href="/contact">Video Diary</LinkPrimary>
					</FooterGroup>
					<FooterGroup title="Language">
						<LinkPrimary href="/">English</LinkPrimary>
						<LinkPrimary href="/">Latviešu</LinkPrimary> 
					</FooterGroup>
					<FooterGroup title="Contact">
						<LinkPrimary href="mailto:contact@milrstudio.com">contact@milrstudio.com</LinkPrimary>
						<LinkPrimary href="tel:+37128755431">+371 28 755 431</LinkPrimary>
						<LinkPrimary href="https://instagram.com/" target="_blank">Instagram</LinkPrimary>
						<address className="text-body-1 not-italic mt-[24px]">Aleksandra Čaka iela 22, Rīga</address>
					</FooterGroup>
					<FooterGroup title="Hours">
						<p className="text-body-1">Mon – Fri</p>
						<p className="text-body-1">8:00 – 19:00</p>
					</FooterGroup>
				</div>
				{/* mt-auto eats the free space left in the flex column, so this sits on the footer's bottom
				    edge while the footer is taller than its content, and simply follows the content once
				    it is not. */}
				<div className="text-background/50 w-full flex justify-between mt-auto border-t border-background/20 pt-[24px] pb-[48px]">
					<p>2026. All Rights Reserved.</p>
					<p>Website by <LinkSecondary noPadding target="_blank" href="http://alensbelikovs.com/">AB</LinkSecondary></p>
				</div>
			</footer>
		</div>
	)
}