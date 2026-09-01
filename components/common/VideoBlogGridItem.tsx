import CardGridItem from "@/components/common/CardGridItem"
import type { VideoBlogType } from "@/types/ContentTypes"
import formatDate from "@/utils/formatDate"

// A video blog's info box, and the whole of what makes a blog card a blog card — the cover, the
// placement and the reveal are CardGridItem's, shared with /projects. Date over title, stacked,
// where a project puts title and category on one line.
//
// The stack is its own flex column rather than gap on the card: the card is a block box so that the
// variant's aspect can measure the cover alone, which leaves the caption to bring its own spacing.
export default function VideoBlogGridItem(
	{ blog, className, delay, onOpen }:
	{ blog: VideoBlogType, className: string, delay?: number, onOpen: (blog: VideoBlogType) => void }
) {
	const { img, title, _createdAt } = blog

	return (
		<CardGridItem
			img={img}
			alt={title}
			className={className}
			delay={delay}
			onPress={() => onOpen(blog)}
			info={
				<div className="mt-small flex flex-col gap-small">
					<p className="text-small">{formatDate(_createdAt)}</p>
					<h3 className="text-body-3 group-hover:underline group-focus-visible:underline">
						{title}
					</h3>
				</div>
			} />
	)
}
