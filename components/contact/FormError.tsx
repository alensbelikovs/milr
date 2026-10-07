"use client"
import TextLineSplit from "@/components/animation/TextLineSplit"
import BodyLinkSecondary from "@/components/buttons/BodyLinkSecondary"
import { useSite } from "@/components/layout/SiteProvider"
import Heading128 from "@/components/typography/Heading128"
import Lines from "@/components/typography/Lines"
import telHref from "@/utils/telHref"

// Shown when sending fails, pointing to the studio's email and phone; the delays give it a cascade
export default function FormError() {
	const { information, dict } = useSite()
	const { error } = dict.contact

	return (
		<>
			<Heading128 className="mb-size-192">{error.heading}</Heading128>
			<div className="col-span-full flex flex-col items-center text-center gap-size-96">
				<div className="flex flex-col gap-size-48">
					<TextLineSplit className="text-size-24 font-serif" delay={0.1}>
						{error.lead}
					</TextLineSplit>
					<TextLineSplit as="h3" className="text-size-36" delay={0.2}>
						<Lines lines={error.title} />
					</TextLineSplit>
				</div>
				{
					information &&
					<div className="flex flex-col items-center gap-size-12">
						{/* Padding on each line keeps the underline inside its mask */}
						<TextLineSplit as="div" linesClassName="pb-1" delay={0.4}>
							<BodyLinkSecondary href={`mailto:${information.email}`}>
								{information.email}
							</BodyLinkSecondary>
						</TextLineSplit>
						<TextLineSplit as="div" linesClassName="pb-1" delay={0.5}>
							<BodyLinkSecondary href={telHref(information.phone)}>
								{information.phone}
							</BodyLinkSecondary>
						</TextLineSplit>
					</div>
				}
			</div>
		</>
	)
}
