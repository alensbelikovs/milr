import { Children, type ReactNode } from "react"

// One fact about a work: its name on the left, its value hard against the right, a rule under both.
//
// Every child is wrapped in a mask of its own rather than the whole value cell in one, which is what
// lets a row hold several values that arrive one after another — the services do. A row given one
// child is the ordinary case and gets one mask, with nothing to stagger against.
//
// toArray rather than Children.map, because a row is written with conditions in it — a value the work
// does not carry renders nothing — and toArray drops the nulls and booleans that come of that instead
// of handing back masks with nothing inside them.
//
// The masks clip on the y axis only in spirit: overflow-hidden clips both, and an underlined value
// sits a few pixels below its own line box. The padding inside each moving box takes the underline
// with it, and the matching negative margin on the mask keeps the row the height it would have been.
export default function DetailTableRow(
	{ label, children }:
		{ label: string; children: ReactNode }) {
	const values = Children.toArray(children)

	return (
		<div
			data-table-row
			className="flex justify-between gap-size-48
			py-size-16 border-b border-foreground/10 items-end">
			<div className="overflow-hidden flex self-start">
				<h5 data-table-label className="block font-serif text-size-18 opacity-50">{ label }</h5>
			</div>
			<div className="flex flex-wrap max-w-1/2 justify-end gap-size-16 text-size-16 text-right">
				{values.map((value, index) => (
					<div key={index} className="overflow-hidden">
						<div data-table-value className="block pb-[0.3em]">{value}</div>
					</div>
				))}
			</div>
		</div>
	)
}
