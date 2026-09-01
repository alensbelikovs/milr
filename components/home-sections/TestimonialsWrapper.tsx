import Testimonials from "@/components/common/Testimonials"
import { getTestimonials } from "@/utils/sanityGetters"

// How many testimonials the home section carries. A ceiling rather than a target: the studio holds
// what it holds, and this is the point past which a row of numbers stops being something a reader
// would work through.
const LIMIT = 6

// The home section's testimonials, fetched and decided on in one place — which is the whole reason
// this exists rather than the page awaiting getTestimonials itself.
//
// Everything that can go wrong with this section is inside this component: the request, the empty
// answer, and the choice not to render. The page composes sections and does not know what any of
// them are made of, so a studio with no testimonials in it is a section that quietly is not there,
// not a page that has to check something before it can lay itself out. HomeFeaturedWork and
// HomeFeaturedBlogs are built the same way and stand down the same way.
//
// The early return is belt and braces: Testimonials renders nothing on an empty array by contract.
// It is here anyway because that contract is the component's, and this component's own answer to
// "is there a section here at all" should not depend on reading another file to find out.
export default async function TestimonialsWrapper() {
	const testimonials = await getTestimonials(LIMIT)

	if (testimonials.length === 0) return null

	return <Testimonials testimonials={testimonials} />
}
