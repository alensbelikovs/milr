import { Children, isValidElement } from "react"
import SectionNav from "@/components/navigation/SectionNav"
import slugify from "@/utils/slugify"

export type SectionNavLink = { id: string; label: string }

// A section names itself: it renders its own <Section label> and carries the same label
// as a navLabel property on the component. Read here off the element's type, which is
// what lets the label live with the section while the list of links is still assembled
// on the server, in the order the page composed them.
//
// This works because the sections are server components — the element type is the
// function itself, properties and all. A "use client" section would arrive as a module
// reference with no navLabel on it and would silently drop out of the nav, so a section
// that needs a client boundary should keep it below this level.
function navLabelOf(child: { type: unknown }) {
	if (typeof child.type !== "function") return undefined
	return (child.type as { navLabel?: string }).navLabel
}

// Wraps the page's sections and populates SectionNav from them.
//
// This stays a server component, which is the whole point. Children handed to a server
// component are still plain element objects here — not rendered output — so they can be
// inspected to build the link list. Nothing is cloned and nothing is wrapped: {children}
// goes out exactly as it came in, so the sections stay server components and remain free
// to fetch their own data.
//
// The interactive half lives entirely in SectionNav, which receives the links as plain
// data and finds the sections in the DOM by id. No section ever carries a handler, a ref,
// or a client boundary.
export default function SectionNavWrapper(
	{ children }: { children: React.ReactNode }
) {
	const links: SectionNavLink[] = Children.toArray(children)
		.filter(isValidElement)
		.map(navLabelOf)
		.filter((label): label is string => Boolean(label))
		.map(label => ({ id: slugify(label), label }))

	return (
		<>
			<SectionNav links={links} />
			{children}
		</>
	)
}
