import { Children } from "react"
import RevealMask from "@/components/common/RevealMask"

// data-footer-group is what Footer's ScrollTrigger reads to find a group, and the masks are what it
// animates. Each line gets its own mask, so a group can unfold line by line rather than as one block.
export default function FooterGroup(
	{ children, title }:
	{ children: React.ReactNode, title: string }
) {
	return (
		<div data-footer-group className="flex gap-regular flex-col">
			<RevealMask>
				<h5 className="text-body-1 font-serif">{ title }</h5>
			</RevealMask>
			<div className="flex flex-col">
				{Children.map(children, child => <RevealMask>{child}</RevealMask>)}
			</div>
		</div>
	)
}
