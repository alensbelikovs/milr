import { type PostType } from "@/types/ContentTypes"
import PostCard from "@/components/cards/PostCard"

// Kept beside the class that sets it, so the two cannot drift: it is what turns a card's place in
// the list into its place in a row, which is what the reveal staggers by.
const COLUMNS = 4

export default function PostGrid(
	{ posts }:
		{ posts: PostType[] })
{
	return (
		// auto-rows-fr sizes every row off the tallest card in the grid rather than the tallest in
		// that row, so a long title on the first row does not leave the rows below it at a different
		// height. With the cards topped out (see PostCard) the slack lands under the shortest titles,
		// where nothing is drawn, and every image sits on the same rhythm down the page.
		<div className="col-span-full grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-y-size-64 gap-x-size-24">
			{posts.map((post, i) => (
				<PostCard key={`post-${i}`} post={post} index={i % COLUMNS} />
			))}
		</div>
	)
}
