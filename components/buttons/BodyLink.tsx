import Link from "@/components/navigation/LocaleLink"
import ClipReveal from "@/components/animation/ClipReveal"
import ArrowRight from "@/components/icons/ArrowRight"

// A link styled as BodyButton, uncovered by ClipReveal
export default function BodyLink(
	{ children, href, className = "", delay }: {
		children: React.ReactNode,
		href: string,
		className?: string,
		delay?: number
	}) {
	return (
		<ClipReveal className={className} delay={delay}>
			<Link
				href={href}
				className="
					group text-size-16
					gap-size-96 w-full lg:w-fit
					flex items-center justify-between
					cursor-pointer capitalize
					bg-foreground/10 backdrop-blur-2xl text-foreground
					hover:bg-accent hover:text-background
					rounded-sm p-size-16 lg:p-size-12
				">
				<span>{children}</span>
				<span className="relative flex overflow-hidden">
					<ArrowRight dimensions={14} fill="currentColor" />
				</span>
			</Link>
		</ClipReveal>
	)
}
