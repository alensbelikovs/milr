import TextLineSplit from "@/components/animation/TextLineSplit"
import BodyLink from "@/components/buttons/BodyLink"
import Heading128 from "@/components/typography/Heading128"

// Shown once the message is sent; the delays give it a top-down cascade
export default function FormSuccess() {
	return (
		<>
			<Heading128 className="mb-size-192">Thank You!</Heading128>
			<div className="col-span-full flex flex-col items-center text-center gap-size-96">
				<div className="flex flex-col gap-size-48">
					<TextLineSplit className="text-size-24 font-serif" delay={0.1}>
						Chat Soon:
					</TextLineSplit>
					<div className="flex flex-col gap-size-12">
						<TextLineSplit as="h3" className="text-size-36" delay={0.2}>
							September 15
						</TextLineSplit>
						<TextLineSplit as="h4" className="text-size-24" delay={0.3}>
							between 8:00 – 19:00
						</TextLineSplit>
					</div>
				</div>
				<div className="flex flex-col items-center gap-size-12">
					<BodyLink href="/" delay={0.4}>View Confirmation</BodyLink>
				</div>
			</div>
		</>
	)
}
