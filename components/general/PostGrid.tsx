import { type PostType } from "@/types/ContentTypes"
import PostCard from "@/components/general/PostCard"

export default function PostGrid(
	{ posts }:
		{ posts: PostType[] })
{
	return (
		<div className="col-span-full grid grid-cols-4 gap-y-size-64 gap-x-size-24">
			{posts.map((post, i) => (
				<PostCard key={`post-${i}`} post={post} />
			))}
		</div>
	)
}
