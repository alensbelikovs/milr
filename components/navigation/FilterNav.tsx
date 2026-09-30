"use client"
import type { MouseEvent } from "react"
import NavLink from "@/components/navigation/NavLink"
import FilterNavMobile from "@/components/navigation/FilterNavMobile"
import clickChangesNothing from "@/utils/clickChangesNothing"
import { workHref } from "@/utils/workUrl"
import { type WorkCategory, type WorkType } from "@/types/ContentTypes"

// Sticky filter bar for the work index: categories from the left edge, types from the right.
//
// Links, not buttons: every filter is a distinct, addressable state — worth sharing, worth going Back
// to — and a real <a href> is what keeps cmd-click and prefetch working. Picking one keeps the other
// filter and drops the page, since page 3 of one set is not a place in another.
//
// A client component only for the click guard. Picking the filter already showing is a navigation to
// the address the page is on, and TransitionControl would spend a whole curtain arriving back where it
// started. The guard asks of the actual address rather than of `active`, because "All Categories" on
// page 2 is active and still goes somewhere: page 1.
//
// scroll is off because TransitionControl does the scrolling, under the curtain. Next's own would
// move the page being left while it is still on screen.
export default function FilterNav(
	{ categories, types, activeCategory, activeType }:
	{
		categories: WorkCategory[]
		types: WorkType[]
		activeCategory: string | null
		activeType: string | null
	}
) {
	const guard = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
		if (clickChangesNothing(href)) event.preventDefault()
	}

	const categoryLink = (slug: string | null, label: string) => {
		const href = workHref({ category: slug, type: activeType })
		return (
			<NavLink
				key={slug ?? "all"}
				href={href}
				active={slug === activeCategory}
				onClick={guard(href)}
				scroll={false}>
				{label}
			</NavLink>
		)
	}

	const typeLink = (slug: string | null, label: string) => {
		const href = workHref({ category: activeCategory, type: slug })
		return (
			<NavLink
				key={slug ?? "all"}
				href={href}
				active={slug === activeType}
				onClick={guard(href)}
				scroll={false}>
				{label}
			</NavLink>
		)
	}

	// Below lg the bar is replaced by FilterNavMobile's button and sheet — two rows of links side by
	// side have no room there.
	return (
		<>
			<FilterNavMobile
				categories={categories}
				types={types}
				activeCategory={activeCategory}
				activeType={activeType} />
			{/* grid-standard spelled out: it lives in a layer after Tailwind's utilities, so its own
			    display:grid would win over hidden and the bar would show on mobile regardless. */}
			<nav
				aria-label="Filter work"
				className="hidden lg:grid grid-cols-12 gap-x-size-24 px-size-24
				bg-background/50 backdrop-blur-2xl py-size-24 sticky top-0 left-0 z-10">
				<div className="col-start-2 col-span-10 flex justify-between">
					<div className="flex flex-row gap-size-48">
						{categoryLink(null, "All Categories")}
						{categories.map(category => categoryLink(category.slug, category.name))}
					</div>
					{/* Reversed so the list reads outward from the right edge: "All Types" sits against
					    it, mirroring "All Categories" on the left, while the DOM order stays the same
					    as the left container's. */}
					<div className="flex flex-row-reverse gap-size-48">
						{typeLink(null, "All Types")}
						{types.map(type => typeLink(type.slug, type.name))}
					</div>
				</div>
			</nav>
		</>
	)
}
