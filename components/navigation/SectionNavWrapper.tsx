import { Children, isValidElement } from "react"
import SectionNav from "@/components/navigation/SectionNav"
import SectionNavMobile from "@/components/navigation/SectionNavMobile"
import { getDictionary, type Dictionary } from "@/lib/dictionaries"

export type SectionNavLink = { id: string, label: string }
export type NavId = keyof Dictionary["sections"]

// Builds the section nav from each child's static navId, labelled from dict.sections. Sections must be
// server components, since a client component arrives as a module reference without the property.
export default async function SectionNavWrapper({ children }: { children: React.ReactNode }) {
	const dict = await getDictionary()
	const links: SectionNavLink[] = Children.toArray(children)
		.filter(isValidElement)
		.map(child => typeof child.type === "function"
			? (child.type as { navId?: NavId }).navId
			: undefined)
		.filter((id): id is NavId => Boolean(id))
		.map(id => ({ id, label: dict.sections[id] }))

	return (
		<>
			<SectionNav links={links} />
			<SectionNavMobile links={links} />
			{children}
		</>
	)
}
