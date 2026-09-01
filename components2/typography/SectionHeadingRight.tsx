import TextLineReveal from "@/components2/typography/TextLineReveal"

export default function SectionHeadingRight(
	{ children }:
	{ children: React.ReactNode })
{
	return (
		<div className="grid grid-cols-12 gap-size-24 px-size-24 pb-size-96">
			<div className="col-start-7 col-span-3">
				<TextLineReveal as="h2" className="text-size-72">
					{children}
				</TextLineReveal>
			</div>
		</div>
	)
}
