import Heading128 from "@/components/typography/Heading128"

// count is how many of the thing the heading names, printed beside it in the serif. Left off, the
// heading stands alone.
export default function HeroCommonList(
	{ heading, count }:
		{ heading: string, count?: number }) {
	return (
		<section className="grid-standard pt-size-192">
			<Heading128
				serif={count === undefined ? undefined : `( ${count} )`}
				className="mb-size-192">
				{heading}
			</Heading128>
		</section>
	)
}
