"use client"

import { useRef, useState } from "react"
import { useLenis } from "lenis/react"
import Pagination from "@/components2/actions/Pagination"
import SectionTitle from "@/components2/typography/SectionTitle"
import TestimonialBody from "@/components2/typography/TestimonialBody"
import TestimonialFootnote from "@/components2/typography/TestimonialFootnote"

// Placeholder data, standing in for what the testimonials query will hand over. Long enough to wrap
// over several lines on a desktop column, because the entrance staggers line by line and a quote
// that fits on one has nothing to stagger.
const TESTIMONIALS = [
	{
		quote:
			`"We came in with a hundred Pinterest boards and no idea how to make them fit our ` +
			`actual apartment. Rinalds asked more questions about our morning routine than our ` +
			`style, and somehow the result feels exactly like us."`,
		author: "Rinalds",
		note: "Reflecting on his home redesign",
	},
	{
		quote:
			`"Our salon had to work for eleven hours a day before it had to look like anything. ` +
			`He watched a full shift before drawing a single layout, and the room we ended up with ` +
			`moves clients through it so quietly that nobody notices the design at all."`,
		author: "Elza",
		note: "On the studio she opened last spring",
	},
	{
		quote:
			`"We had lived with the same awkward hallway for nine years and assumed it was simply ` +
			`the shape of the flat. It took one afternoon of questions and a wall moved half a metre, ` +
			`and now it is the part of the house everyone gathers in."`,
		author: "Martins",
		note: "Two years after the renovation",
	},
]

export default function Testimonials() {
	// Which quote is showing. An index rather than the quote itself, because the numbers below have
	// to render a position either way and an index is what they already are.
	//
	// State rather than a URL param, the line the legacy testimonials draw too: nothing links to the
	// third quote on the home page, and Back should mean the page before this one rather than the
	// quote before this one.
	const [active, setActive] = useState(0)

	const sectionRef = useRef<HTMLElement>(null)
	const lenis = useLenis()

	// Clamped rather than wrapped, matching Prev and Next stopping at the ends of a paged list.
	const select = (page: number) => {
		const index = Math.min(Math.max(page - 1, 0), TESTIMONIALS.length - 1)
		if (index === active) return

		setActive(index)

		const section = sectionRef.current
		if (!section) return

		// Through Lenis, which owns the document scroll in root mode — see ReactLenis in
		// app/layout.tsx. A native scroll would move window.scrollY outside its rAF loop, leaving its
		// internal target on the old value so the next wheel event pulls back against the jump.
		// scrollIntoView is only for the frames before useLenis resolves.
		//
		// Fired alongside the quote leaving rather than before it, so the two play together.
		if (lenis) lenis.scrollTo(section)
		else section.scrollIntoView({ behavior: "smooth" })
	}

	const testimonial = TESTIMONIALS[active]

	return (
		<section ref={sectionRef}>
			<SectionTitle chapter="3" title="Client Stories" />
			<TestimonialBody>{testimonial.quote}</TestimonialBody>
			<TestimonialFootnote author={testimonial.author} note={testimonial.note} />
			{/* Pagination renders no box of its own by design, so the twelve-column row it sits in is
			    this one. Same column as the footnote above it. */}
			<div className="grid grid-cols-12 gap-size-24 px-size-24 pt-size-32">
				<Pagination
					label="Testimonials"
					className="col-start-7 col-span-3 flex flex-col gap-size-24"
					currentPage={active + 1}
					totalPages={TESTIMONIALS.length}
					onSelect={select} />
			</div>
		</section>
	)
}
