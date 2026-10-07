"use client"
import TextLineSplit from "@/components/animation/TextLineSplit"
import { useSite } from "@/components/layout/SiteProvider"
import telHref from "@/utils/telHref"

export default function ContactIntro() {
	const { information, dict } = useSite()
	const { intro } = dict.contact

	// Keyed so the split is redone when the contact links arrive, rather than React editing split markup.
	// Padding on each line keeps the underlines inside their masks.
	return (
		<div className="
			col-start-1 col-span-full mt-size-48
			md:col-start-2 md:col-span-10
			lg:col-start-7 lg:col-span-5 lg:mt-0
			flex items-end
		">
			<TextLineSplit
				key={information ? "with-contacts" : "without-contacts"}
				className="text-size-24 max-w-xs"
				linesClassName="pb-1">
				{intro.start}
				{
					information &&
					<>
						{intro.direct}{" "}
						<a className="underline hover:no-underline" href={`mailto:${information.email}`}>
							{intro.email}
						</a>
						{` ${intro.or} `}
						<a className="underline hover:no-underline" href={telHref(information.phone)}>
							{intro.phone}
						</a>
					</>
				}
				.
			</TextLineSplit>
		</div>
	)
}
