import Link from "next/link"

// The underlined styling the detail table's values wear, kept here so the link and the service button
// beside it cannot drift into two things that only look alike — see ServiceButton.
//
// inline-block, so the underline and the click target stop at the end of the words rather than
// running the width of the cell they are aligned in.
export const BODY_SECONDARY = `
	inline-block text-size-16
	underline underline-offset-4 hover:no-underline
	cursor-pointer
`

// A link at the small end of the type scale: the category and the type in a work's detail table, each
// going to the work index filtered to it.
//
// The secondary of BodyLink, which is a filled block — this is a word in a line of text that happens
// to be a link, so it is underlined and nothing more. It carries no reveal of its own either: the
// table it sits in reveals its rows, and a second entrance inside one would fight it.
export default function BodyLinkSecondary(
	{ children, href = "#", target = "_self" }:
		{ children: React.ReactNode; href?: string; target?: string }) {
	return (
		<Link className={BODY_SECONDARY} href={href} target={target}>
			{ children }
		</Link>
	)
}
