// action is anything that belongs on the label's line, set against the far end of it — the menu's
// language pair is the one that does. A slot rather than a flag: this component has no business
// knowing which control a caller wants there, and a boolean per control is a prop per control.
//
// The label and the action share a flex row, so they sit centred against each other whatever the two
// heights are. grow on the label is what keeps the row honest when there is no action: a lone flex
// item is only as wide as its text, which would strand the label of a text-right list — Hours,
// Address — against the left edge instead of the right. Growing, it fills the row exactly as the
// block-level heading it used to be did.
export default function DetailList(
	{ label, children, action, className = "" }:
		{ label: string; children: React.ReactNode, action?: React.ReactNode, className?: string }) {
	const labelId = `detail-list-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

	return (
		<div className={className}>
			<div className="flex items-center justify-between gap-size-24">
				<h5 id={labelId} className="font-serif text-size-18 opacity-50 grow">{ label }</h5>
				{action}
			</div>
			<ul aria-labelledby={labelId} className="text-size-16 mt-size-48">
				{children}
			</ul>
		</div>
	)
}
