import TestimonialLines from "@/components2/typography/TestimonialLines"

// The attribution under a quote. It leaves and arrives on the same beat the quote does, because both
// go through TestimonialLines with the same timings.
//
// Both paragraphs sit inside one TestimonialLines rather than one each, so the name and the note
// stagger as a single run of lines instead of two runs that happen to start together.
//
// The token joins both fields because either can change on its own: two clients could share a first
// name, and the note is what would tell them apart.
export default function TestimonialFootnote(
	{ author, note }:
		{ author: string; note?: string }) {
	return (
		<div className="grid grid-cols-12 gap-size-24 px-size-24">
			<div className="col-start-7 col-span-3">
				<TestimonialLines token={`${author}|${note ?? ""}`}>
					<p className="text-size-24">– {author}</p>
					{note && <p className="text-size-18 font-serif">{note}</p>}
				</TestimonialLines>
			</div>
		</div>
	)
}
