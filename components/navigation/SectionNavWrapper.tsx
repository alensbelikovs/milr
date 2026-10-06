import { Children, isValidElement } from "react"
import SectionNav from "@/components/navigation/SectionNav"
import SectionNavMobile from "@/components/navigation/SectionNavMobile"
import slugify from "@/utils/slugify"

export type SectionNavLink = { id: string, label: string }

// Builds the section nav from each child's static navLabel. Sections must be server components,
// since a client component arrives as a module reference without the property.
export default function SectionNavWrapper({ children }: { children: React.ReactNode }) {
	const links: SectionNavLink[] = Children.toArray(children)
		.filter(isValidElement)
		.map(child => typeof child.type === "function"
			? (child.type as { navLabel?: string }).navLabel
			: undefined)
		.filter((label): label is string => Boolean(label))
		.map(label => ({ id: slugify(label), label }))

	return (
		<>
			<SectionNav links={links} />
			<SectionNavMobile links={links} />
			{children}
		</>
	)
}
