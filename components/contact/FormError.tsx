"use client"
import TextLineSplit from "@/components/animation/TextLineSplit"
import BodyLinkSecondary from "@/components/buttons/BodyLinkSecondary"
import Heading128 from "@/components/typography/Heading128"
import { useGeneralInformation } from "@/store/GeneralInformationStore"
import telHref from "@/utils/telHref"

// Shown when sending fails, pointing to the studio's email and phone; the delays give it a cascade
export default function FormError() {
	const information = useGeneralInformation(state => state.information)

	return (
		<>
			<Heading128 className="mb-size-192">Oops!</Heading128>
			<div className="col-span-full flex flex-col items-center text-center gap-size-96">
				<div className="flex flex-col gap-size-48">
					<TextLineSplit className="text-size-24 font-serif" delay={0.1}>
						Something went wrong:
					</TextLineSplit>
					<TextLineSplit as="h3" className="text-size-36" delay={0.2}>
						Please contact <br /> me directly
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
