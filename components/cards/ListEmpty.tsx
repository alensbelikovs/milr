import TextMaskReveal from "@/components/animation/TextMaskReveal"
import BodyLink from "@/components/buttons/BodyLink"

// Shown in place of a grid when a list has nothing to show; href adds a reset link
export default function ListEmpty({ children, href }: { children: React.ReactNode, href?: string }) {
	return (
		<div className="
			col-start-1 col-span-12
			md:col-start-2 md:col-span-10
			flex flex-col items-start gap-size-48
		">
			<TextMaskReveal as="h2" className="text-size-36">{children}</TextMaskReveal>
			{href && <BodyLink href={href}>Reset filters</BodyLink>}
		</div>
	)
}
