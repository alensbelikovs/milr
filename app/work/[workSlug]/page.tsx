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
import { getLatestWork, getWorkBySlug } from "@/utils/sanityGetters"

const MORE_WORK = 4

export default async function WorkShow({ params }: PageProps<"/work/[workSlug]">) {
	const { workSlug } = await params
	const [work, moreWork] = await Promise.all([
		getWorkBySlug(workSlug),
		getLatestWork({ limit: MORE_WORK, except: workSlug }),
	])

	if (!work) notFound()

	const place = [work.location?.city, work.location?.country].filter(Boolean).join(", ")

	return (
		<main>
			<MainNav color="text-background" />
			<HeroCommon heading={work.title} subheading={work.subtitle} img={work.img} />
			<PageReadySignal />
			<Section className="pt-size-48 md:pt-size-96 lg:pt-size-192 pb-size-192">
				<Body36Container>
					{work.description.split(/\n+/).map((paragraph, index) => (
						<Body36 key={index}>{paragraph}</Body36>
					))}
				</Body36Container>
				{/* Optional facts only get a row when the work has them */}
				<DetailTable className="mt-size-96">
					{place && <DetailTableRow label="Location"><span>{place}</span></DetailTableRow>}
					{
						work.area !== null &&
						<DetailTableRow label="Area"><span>{work.area} m²</span></DetailTableRow>
					}
					{
						work.sector.length > 0 &&
						<DetailTableRow label="Sector">
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
						<DetailTableRow label="Solutions">
							{work.solutions.map(solution => (
								<SolutionButton key={solution._key} solution={solution} />
							))}
						</DetailTableRow>
					}
					<DetailTableRow label="Published">
						<span>{formatDate(work._createdAt)}</span>
					</DetailTableRow>
				</DetailTable>
			</Section>
			<Gallery images={work.gallery} title={work.title} />
			{work.testimonial && <Testimonial testimonial={work.testimonial} />}
			{moreWork.length > 0 && <LatestWork work={moreWork} heading="More Work" />}
		</main>
	)
}
