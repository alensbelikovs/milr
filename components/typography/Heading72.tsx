import HeadingSpanSerif from "@/components/typography/HeadingSpanSerif"

export default function Heading72(
	{ children, serif, className }:
		{ children: React.ReactNode; serif?: string; className?: string })
{
	return (
		<div className={`col-start-2 col-span-10 ${className}`}>
			<h3 className="text-size-96">
				{children}
				{serif && <HeadingSpanSerif>{serif}</HeadingSpanSerif>}
			</h3>
		</div>
	)
}
