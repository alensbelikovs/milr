import SectionTitle from "@/components2/typography/SectionTitle"
import BodyPrimary from "@/components2/typography/BodyPrimary"
import MaskReveal from "@/components2/animation/MaskReveal"
import SerifSpan from "@/components2/typography/SerifSpan"
import ItemGrid from "@/components2/grids/ItemGrid"
import SectionEnd from "@/components2/typography/SectionEnd"
import BodyLink from "@/components2/actions/BodyLink"

// Temporary
import type { ProjectListType } from "@/types/ContentTypes"

// The mask element is the span itself, so it has to be inline-block: overflow clips a box, and a
// bare inline span is not one, so nothing would be masked. align-top pins it to the top of the line
// box, which is what makes it read as a superscript on the last word rather than a second word.
//
// The gap is a margin rather than a space in the markup, because a space would give the browser a
// spot to break the count onto a line of its own.
const COUNT_MASK_CLASS_NAME = "inline-block align-top ml-size-6"

// Object literals rather than `new ProjectListType(...)`: it is a type alias, not a class. `import
// type` erases it outright, so there is nothing left at runtime to construct — the annotation on the
// array is what checks these instead, and it checks every field rather than just the ones passed.
const projects: ProjectListType[] = [
	{ title: "MR-000", slug: "hello-world-1", mediaUrl: null },
	{ title: "MR-001", slug: "hello-world-2", mediaUrl: null },
	{ title: "MR-002", slug: "hello-world-3", mediaUrl: null },
	{ title: "MR-003", slug: "hello-world-4", mediaUrl: null },
]

export default function FeaturedProjects() {
	if (!projects) return null

	return (
		<section>
			<SectionTitle chapter="2" title="Notable Work" />
			<BodyPrimary forceSpacing="pt-size-96 pb-size-32">
				My Favourite Projects <SerifSpan size="16">4</SerifSpan>
			</BodyPrimary>
			<ItemGrid items={projects} />
			<SectionEnd link={<BodyLink href="/projects">See More Work</BodyLink>}>
				Every space is shaped around a real routine, designed to feel as good as it functions.
			</SectionEnd>
		</section>
	)
}
