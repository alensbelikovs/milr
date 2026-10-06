import HeroList from "@/components/sections/HeroList"
import Section from "@/components/layout/Section"
import PostGrid from "@/components/cards/PostGrid"
import ListEmpty from "@/components/cards/ListEmpty"
import Pagination from "@/components/pagination/Pagination"
import PageReadySignal from "@/components/transition/PageReadySignal"
import { getPostsPage } from "@/utils/sanityGetters"
import resolvePage from "@/utils/resolvePage"

const POSTS_PER_PAGE = 12

export default async function DiaryPage({ searchParams }: PageProps<"/diary">) {
	const params = await searchParams
	const page = resolvePage(params.page)

	const start = (page - 1) * POSTS_PER_PAGE
	const { posts, count } = await getPostsPage({ start, end: start + POSTS_PER_PAGE })

	return (
		<main className="min-h-screen">
			<HeroList heading="Diary" count={count} />
			<Section className="py-size-96 mb-size-96">
				{count === 0 ? <ListEmpty>No posts yet.</ListEmpty> : <PostGrid posts={posts} />}
				<Pagination
					currentPage={page}
					totalPages={Math.ceil(count / POSTS_PER_PAGE)}
					pathname="/diary"
					searchParams={params} />
				<PageReadySignal token={JSON.stringify(params)} />
			</Section>
		</main>
	)
}
