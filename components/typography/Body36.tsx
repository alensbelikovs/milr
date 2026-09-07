import BodySpanSerif from "@/components/typography/BodySpanSerif"

export default function Body36(
	{ children, serif, className }:
		{ children: React.ReactNode; serif?: string; className?: string })
{
	return (
		<div className={`col-start-2 col-span-5 ${className}`}>
			<p className="text-size-36">
				{children}
				{serif && <BodySpanSerif>{serif}</BodySpanSerif>}
			</p>
		</div>
	)
}
