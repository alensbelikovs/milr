// Every grid lays its items out on a repeating rhythm of placement classes, and any of them can
// hold more items than its rhythm has entries. Wraps, so the seventh card in a six-variant list
// starts the pattern over rather than falling out of the grid with no placement at all.
//
// Guards the empty list because the modulo would be NaN, and an undefined className reaching an
// item is a crash rather than a missing style.
export const variantAt = (variants: readonly string[], index: number) =>
	variants.length === 0 ? "" : variants[index % variants.length]
