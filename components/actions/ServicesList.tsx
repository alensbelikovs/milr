"use client"

import List from "@/components/actions/List"
import ListItem, { type ListLinkItem } from "@/components/actions/ListItem"

export default function ServicesList(
	{ items, hovered, setHovered, className }:
	{
		items: ListLinkItem[]
		hovered: number | null
		setHovered: (index: number | null) => void
		className?: string
	})
{
	return (
		<List className={className}>
			{items.map((item, index) => (
				<ListItem
					key={item.label}
					href={item.href}
					index={index}
					hovered={hovered}
					onMouseEnter={() => setHovered(index)}
					onMouseLeave={() => setHovered(null)}
					onFocus={() => setHovered(index)}
					onBlur={() => setHovered(null)}>
					{item.label}
				</ListItem>
			))}
		</List>
	)
}
