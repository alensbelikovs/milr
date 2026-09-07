"use client"

import { useState } from "react"
import List from "@/components/actions/List"
import ListItem, { type ListLinkItem } from "@/components/actions/ListItem"

// Self-contained: nothing outside the sidebar reacts to which row is hovered,
// so the state stays here.
export default function NavList(
	{ items, className }:
	{ items: ListLinkItem[]; className?: string })
{
	const [hovered, setHovered] = useState<number | null>(null)

	return (
		<List className={className}>
			{items.map((item, index) => (
				<ListItem
					key={item.href}
					href={item.href}
					index={index}
					hovered={hovered}
					onMouseEnter={() => setHovered(index)}
					onMouseLeave={() => setHovered(null)}
					// focusin/focusout bubble, so these also fire for the inner Link.
					onFocus={() => setHovered(index)}
					onBlur={() => setHovered(null)}>
					{item.label}
				</ListItem>
			))}
		</List>
	)
}
