// A labelled list; action sits on the label's line, at the far end
export default function DetailList(
	{ children, label, action, className = "" }: {
		children: React.ReactNode,
		label: string,
		action?: React.ReactNode,
		className?: string
	}) {
	const labelId = `detail-list-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

	return (
		<div className={className}>
			<div className="flex items-center justify-between gap-size-24">
				<h5 id={labelId} className="font-serif text-size-18 opacity-50 grow">{label}</h5>
				{action}
			</div>
			<ul aria-labelledby={labelId} className="text-size-16 mt-size-48">
				{children}
			</ul>
		</div>
	)
}
