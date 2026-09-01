import { Fragment } from "react"
import type { ReactNode } from "react"
import { variantAt } from "@/utils/variantAt"

// The one map every grid in the app runs: place each item on the next step of a rhythm, and break
// between passes of it. /projects, /diary, the home teasers and a project's own gallery all call
// this directly — same variants, same container, different things inside.
//
// renderCard rather than an item component, because the callers need different things built for
// them — a href on one, a press handler on another, a bare image on the last — and none of that
// belongs in here. It stays callable from a client component too, which is what lets
// VideoBlogGridWrapper close over its own useVideoPlayer open() without this module having to know
// a player exists.
//
// No "use client" of its own: called from a page it stays on the server, and pulled in by the blog
// wrapper it compiles into the client graph alongside it.
//
// getKey rather than a slug off the item, because not everything laid out here is a document. A
// gallery image is an array entry on the project it belongs to, identified by the _key Sanity gives
// it and by nothing else — see SCHEMA.md. Asking the caller which field identifies its own items is
// what lets one grid take both without knowing what either is.
//
// cycleSpacer is a className rather than a flag, and leaving it off is how a grid says it has no
// cycle worth breaking — the home teaser's rhythm is one entry long, where every card would close a
// cycle and a spacer would land between all of them.
export default function CardGrid<T>(
	{ items, variants, className, cycleSpacer, getKey, renderCard }:
	{
		items: T[],
		variants: readonly string[],
		className: string,
		cycleSpacer?: string,
		getKey: (item: T) => string,
		renderCard: (item: T, className: string, index: number) => ReactNode
	}
) {
	return (
		<div className={className}>
			{items.map((item, index) => {
				// A full-width spacer closes each pass of the rhythm, so the next pass opens on a clean
				// row instead of the last variant's tail column. It has to be a grid item to force that
				// break, which is also why it is skipped after the final card: there is no next pass to
				// separate, and an empty trailing row is just dead height.
				const closesVariantCycle = cycleSpacer !== undefined
					&& index % variants.length === variants.length - 1
					&& index < items.length - 1

				return (
					<Fragment key={getKey(item)}>
						{renderCard(item, variantAt(variants, index), index)}
						{closesVariantCycle && <div aria-hidden className={cycleSpacer} />}
					</Fragment>
				)
			})}
		</div>
	)
}
