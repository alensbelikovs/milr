import { notFound } from "next/navigation"
import MainNav from "@/components/navigation/MainNav"
import HeroList from "@/components/sections/HeroList"
import Section from "@/components/layout/Section"
import WorkGrid from "@/components/cards/WorkGrid"
import ListEmpty from "@/components/cards/ListEmpty"
import Pagination from "@/components/pagination/Pagination"
import WorkFiltersButton from "@/components/buttons/WorkFiltersButton"
import PageReadySignal from "@/components/transition/PageReadySignal"
import { getSectors, getSolutions, getWork } from "@/utils/sanityGetters"
import resolvePage from "@/utils/resolvePage"
import { getDictionary } from "@/lib/dictionaries"
import { alternates } from "@/lib/i18n"

const WORK_PER_PAGE = 8

export async function generateMetadata() {
	const dict = await getDictionary()
	return { title: dict.nav.work, alternates: alternates("/work") }
}

export default async function WorkPage({ searchParams }: PageProps<"/[lang]/work">) {
	const params = await searchParams
	const [allSectors, allSolutions, dict] = await Promise.all([getSectors(), getSolutions(), getDictionary()])

	// Filters arrive as a single value, repeated values or not at all; an unknown slug is a 404
	const [sectors, solutions] = [
		{ param: params.sectors, all: allSectors },
		{ param: params.solutions, all: allSolutions },
	].map(({ param, all }) => {
		const slugs = param === undefined ? [] : [param].flat()
		if (slugs.some(slug => !all.some(filter => filter.slug === slug))) notFound()
		return slugs
	})
	// Only one sector can be picked
	if (sectors.length > 1) notFound()
	const featured = params.featured === "true"
	const page = resolvePage(params.page)

	const start = (page - 1) * WORK_PER_PAGE
	const { work, count } = await getWork({ sectors, solutions, featured, start, end: start + WORK_PER_PAGE })

	return (
		<main id="main">
			<MainNav color="text-foreground" />
			<HeroList heading={dict.nav.work} count={count}>
				<WorkFiltersButton
					count={count}
					active={{ sectors, solutions, featured }}
					filters={{
						sectors: allSectors,
						solutions: allSolutions.map(({ title, slug }) => ({ title, slug }))
					}} />
			</HeroList>
			<Section noTopPadding className="mb-size-96">
				{
					count === 0
						? <ListEmpty href="/work">{dict.work.empty}</ListEmpty>
						: <WorkGrid work={work} />
				}
				<Pagination
					currentPage={page}
					totalPages={Math.ceil(count / WORK_PER_PAGE)}
					pathname="/work"
					searchParams={params} />
				<PageReadySignal token={JSON.stringify(params)} />
			</Section>
		</main>
	)
}
