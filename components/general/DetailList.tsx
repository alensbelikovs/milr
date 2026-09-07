export default function DetailList(
	{ label, children, className }:
		{ label: string; children: React.ReactNode, className?: string }) {
	const labelId = `detail-list-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

	return (
		<div className={className}>
			<h5 id={labelId} className="font-serif text-size-18 opacity-50">{ label }</h5>
			<ul aria-labelledby={labelId} className="text-size-16 mt-size-48">
				{children}
			</ul>
		</div>
	)
}
