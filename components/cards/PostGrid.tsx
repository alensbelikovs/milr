import PostCard from "@/components/cards/PostCard"
import { type Post } from "@/types/CommonTypes"

export default function PostGrid({ posts }: { posts: Post[] }) {
	return (
		<div className="
			col-start-1 col-span-12
			md:col-start-2 md:col-span-10
			grid grid-cols-2 md:grid-cols-4 auto-rows-fr
			gap-y-size-64 gap-x-size-24
		">
			{posts.map((post, index) => (
				<PostCard key={post._id} post={post} delay={(index % 4) * 0.1} />
			))}
		</div>
	)
}
