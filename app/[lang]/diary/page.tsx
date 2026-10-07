import HeroList from "@/components/sections/HeroList"
import Section from "@/components/layout/Section"
import PostGrid from "@/components/cards/PostGrid"
import ListEmpty from "@/components/cards/ListEmpty"
import Pagination from "@/components/pagination/Pagination"
import PageReadySignal from "@/components/transition/PageReadySignal"
import { getPostsPage } from "@/utils/sanityGetters"
import resolvePage from "@/utils/resolvePage"
import { getDictionary } from "@/lib/dictionaries"
import { alternates } from "@/lib/i18n"

const POSTS_PER_PAGE = 12

export async function generateMetadata() {
	const dict = await getDictionary()
	return { title: dict.nav.diary, alternates: alternates("/diary") }
}

export default async function DiaryPage({ searchParams }: PageProps<"/[lang]/diary">) {
	const params = await searchParams
	const page = resolvePage(params.page)

	const start = (page - 1) * POSTS_PER_PAGE
	const [{ posts, count }, dict] = await Promise.all([
		getPostsPage({ start, end: start + POSTS_PER_PAGE }),
		getDictionary(),
	])

	return (
		<main className="min-h-screen">
			<HeroList heading={dict.nav.diary} count={count} />
			<Section noTopPadding className="mb-size-96">
				{count === 0 ? <ListEmpty>{dict.diary.empty}</ListEmpty> : <PostGrid posts={posts} />}
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
