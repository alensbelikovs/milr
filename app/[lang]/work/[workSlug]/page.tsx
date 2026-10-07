import { notFound } from "next/navigation"
import BodyLinkSecondary from "@/components/buttons/BodyLinkSecondary"
import SolutionButton from "@/components/buttons/SolutionButton"
import DetailTable from "@/components/details/DetailTable"
import DetailTableRow from "@/components/details/DetailTableRow"
import Section from "@/components/layout/Section"
import MainNav from "@/components/navigation/MainNav"
import Gallery from "@/components/sections/Gallery"
import HeroCommon from "@/components/sections/HeroCommon"
import LatestWork from "@/components/sections/LatestWork"
import Testimonial from "@/components/sections/Testimonial"
import PageReadySignal from "@/components/transition/PageReadySignal"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import formatDate from "@/utils/formatDate"
import { getDictionary, getLocale } from "@/lib/dictionaries"
import { alternates } from "@/lib/i18n"
import { getLatestWork, getWorkBySlug } from "@/utils/sanityGetters"

const MORE_WORK = 4

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[workSlug]">) {
	const { workSlug } = await params
	const work = await getWorkBySlug(workSlug)
	return { title: work?.title, alternates: alternates(`/work/${workSlug}`) }
}

export default async function WorkShow({ params }: PageProps<"/[lang]/work/[workSlug]">) {
	const { workSlug } = await params
	const [work, moreWork, dict, lang] = await Promise.all([
		getWorkBySlug(workSlug),
		getLatestWork({ limit: MORE_WORK, except: workSlug }),
		getDictionary(),
		getLocale(),
	])
	const { details } = dict.work

	if (!work) notFound()

	const place = [work.location?.city, work.location?.country].filter(Boolean).join(", ")

	return (
		<main>
			<MainNav color="text-background" />
			<HeroCommon heading={work.title} subheading={work.subtitle} img={work.img} />
			<PageReadySignal />
			<Section>
				<Body36Container>
					{work.description.split(/\n+/).map((paragraph, index) => (
						<Body36 key={index}>{paragraph}</Body36>
					))}
				</Body36Container>
				{/* Optional facts only get a row when the work has them */}
				<DetailTable className="mt-size-96">
					{place && <DetailTableRow label={details.location}><span>{place}</span></DetailTableRow>}
					{
						work.area !== null &&
						<DetailTableRow label={details.area}><span>{work.area} m²</span></DetailTableRow>
					}
					{
						work.sector.length > 0 &&
						<DetailTableRow label={details.sector}>
							{work.sector.map(sector => (
								<BodyLinkSecondary
									key={sector._key}
									href={`/work?sectors=${encodeURIComponent(sector.slug)}`}>
									{sector.title}
								</BodyLinkSecondary>
							))}
						</DetailTableRow>
					}
					{
						work.solutions.length > 0 &&
						<DetailTableRow label={details.solutions}>
							{work.solutions.map(solution => (
								<SolutionButton key={solution._key} solution={solution} />
							))}
						</DetailTableRow>
					}
					<DetailTableRow label={details.published}>
						<span>{formatDate(work._createdAt, lang)}</span>
					</DetailTableRow>
				</DetailTable>
			</Section>
			<Gallery images={work.gallery} title={work.title} />
			{work.testimonial && <Testimonial testimonial={work.testimonial} />}
			{moreWork.length > 0 && <LatestWork work={moreWork} heading={dict.work.moreWork} />}
		</main>
	)
}
