import VideoBlogGridShell from "@/components/common/VideoBlogGridShell"
import type { VideoBlogType } from "@/types/ContentTypes"

const BLOG_VARIANTS = ([
	"col-start-1 col-span-5 [&_h3]:w-3/4",
	"col-start-11 col-span-3",
	"col-start-1 col-span-3",
	"col-span-5 col-start-11 [&_h3]:w-3/4",
])

export default function VideoBlogGrid({ items }: { items: VideoBlogType[] }) {
	return (
		<VideoBlogGridShell
			items={items}
			variants={BLOG_VARIANTS}
			className="
				py-normal-2 grid grid-cols-15 items-start
				gap-x-regular overflow-hidden
			" />
	)
}
