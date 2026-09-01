"use client"

import { useState } from "react"
import type { TestimonialType } from "@/types/ContentTypes"
import Pagination from "@/components/common/Pagination"

// A quote, its author, and a way through them when there is more than one.
//
// An empty array renders NOTHING, and that is the contract every caller is written against rather
// than a defensive check: the home section hands over whatever the studio holds, which may be none,
// and a project hands over the one it references, which is optional in the schema — see SCHEMA.md.
// Both would otherwise need the same guard at the call site, and one of them would eventually forget
// it. A heading over an empty quote is worse than no section at all.
//
// A client component, and only for the selection below. Which quote is showing is state and nothing
// else: it leaves no mark on the URL, because a testimonial is not an address — nothing links to
// "the third quote on the home page", no crawler needs to reach it, and Back should mean the page
// before this one rather than the quote before this one. That is the same line VideoBlogGridItem
// draws for the player, and the reason this pagination is buttons where the list pagination is
// links: a page of /projects IS an address, and this is not.
export default function Testimonials({ testimonials }: { testimonials: TestimonialType[] }) {
	// Which quote is showing. Index rather than the testimonial itself, because the numbers below
	// have to render a position either way and an index is what they already are.
	const [active, setActive] = useState(0)

	// Before the early return would be a hook called conditionally, so the guard sits after it. React
	// counts hooks by call order, and a component that returns early above useState renders a
	// different number of them depending on its props.
	if (testimonials.length === 0) return null

	// One quote is not a pagination — the same reasoning Pagination applies to a single page. Nothing
	// to choose between is furniture for a control with nothing to control, which is exactly the shape
	// a project show page hands over.
	const showPagination = testimonials.length > 1

	// Clamped rather than wrapped, matching Prev and Next stopping at the ends of a paged list. It
	// also keeps the index honest if the array is ever handed over shorter than it was.
	const select = (index: number) =>
		setActive(Math.min(Math.max(index, 0), testimonials.length - 1))

	const testimonial = testimonials[active]

	return (
		<section className="py-section grid grid-cols-12 px-regular gap-y-normal-3 relative bg-background z-1">
			<div className="flex flex-col font-serif col-start-2 col-span-9">
				<span className="block font-serif text-heading-4">”</span>
				<p className="text-heading-2">{testimonial.testimonial}</p>
			</div>
			{/* No name, no line. author is marked required in the schema but comes back null on every
			    quote written before the field existed — see TestimonialType — and an em dash with nobody
			    after it is worse than an unattributed quote.

			    The comma belongs to authorDetail rather than to the name. Printed separately it would
			    trail after every author who has no title. */}
			{testimonial.author && (
				<div className="col-start-2 col-span-5 text-body-2">
					<p>— {testimonial.author}{testimonial.authorDetail && `, ${testimonial.authorDetail}`}</p>
				</div>
			)}
			{showPagination && (
				<Pagination
					label="Testimonials"
					className="col-start-7 col-span-5 flex flex-col gap-normal-3"
					currentPage={active + 1}
					totalPages={testimonials.length}
					onSelect={page => select(page - 1)} />
			)}
		</section>
	)
}
