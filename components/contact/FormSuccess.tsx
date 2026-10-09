"use client"
import TextLineSplit from "@/components/animation/TextLineSplit"
import BodyLink from "@/components/buttons/BodyLink"
import { useSite } from "@/components/layout/SiteProvider"
import Heading128 from "@/components/typography/Heading128"

// Shown once the message is sent; the delays give it a top-down cascade
export default function FormSuccess() {
	const { success } = useSite().dict.contact

	return (
		<>
			<Heading128 className="mb-size-192 mt-size-96">{success.heading}</Heading128>
			<div className="col-span-full flex flex-col items-center text-center gap-size-96">
				<div className="flex flex-col gap-size-48">
					<TextLineSplit className="text-size-24 font-serif" delay={0.1}>
						{success.lead}
					</TextLineSplit>
					<div className="flex flex-col gap-size-12">
						<TextLineSplit as="h3" className="text-size-36" delay={0.2}>
							{success.date}
						</TextLineSplit>
						<TextLineSplit as="h4" className="text-size-24" delay={0.3}>
							{success.time}
						</TextLineSplit>
					</div>
				</div>
				<div className="flex flex-col items-center gap-size-12">
					<BodyLink href="/" delay={0.4}>{success.link}</BodyLink>
				</div>
			</div>
		</>
	)
}
