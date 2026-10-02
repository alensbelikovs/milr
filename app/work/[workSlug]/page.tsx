import { getRandomWork, getWorkBySlug } from "@/utils/sanityGetters"
import { notFound } from "next/navigation"

import HeroCommon from "@/components/sections/HeroCommon"
import Body36Container from "@/components/typography/Body36Container"
import PageReadySignal from "@/components/transition/PageReadySignal"
import Section from "@/components/layout/Section"
import Body36 from "@/components/typography/Body36"
import MainNav from "@/components/navigation/MainNav"
import FeaturedWork from "@/components/sections/FeaturedWork"
import Gallery from "@/components/sections/Gallery"
import Testimonial from "@/components/sections/Testimonial"
import DetailTable from "@/components/details/DetailTable"
import DetailTableRow from "@/components/details/DetailTableRow"
import BodyLinkSecondary from "@/components/buttons/BodyLinkSecondary"
import ServiceButton from "@/components/buttons/ServiceButton"
import formatDate from "@/utils/formatDate"
import withSearchParams from "@/utils/withSearchParams"

// How many pieces the closing "More Work" grid shows.
const MORE_WORK = 4

export default async function WorkShow({ params }: PageProps<"/work/[workSlug]">) {
	const { workSlug } = await params

	// Both at once. The closing grid excludes this page's own piece by SLUG, which the URL already
	// carries — so it does not have to wait on the work itself to come back, and the two requests
	// overlap instead of queueing. Fetched here rather than inside the section for the same reason:
	// a section that fetches cannot be awaited alongside anything else.
	const [work, moreWork] = await Promise.all([
		getWorkBySlug(workSlug),
		getRandomWork({ limit: MORE_WORK, except: workSlug }),
	])

	// No such slug hands over to not-found.tsx, which signals page ready itself so the curtain still
	// lifts. Throwing to global-error instead would replace the root layout — curtain, navbar and all —
	// leaving nothing mounted to resolve the transition.
	if (!work) notFound()

	// Both halves of the location are optional and so is the object holding them, so this is empty
	// whenever there is nothing to print — which is what the row below tests. Joined rather than
	// rendered as two fields, because "Rīga, Latvia" is one fact.
	const place = [work.location?.city, work.location?.country].filter(Boolean).join(", ")

	return (
		<main>
			<MainNav color="text-background" />
			<HeroCommon
				heading={work.title}
				cover={work.cover}
				category={work.category}
				type={work.type}
				subheading={work.summary}
				published={work._createdAt} />
			<PageReadySignal />
			<Section className="pt-size-48 md:pt-size-96 lg:pt-size-192 pb-size-192">
				<Body36Container>
					{work.description.map((paragraph, index) => (
						<Body36 key={index}>{paragraph}</Body36>
					))}
				</Body36Container>
				{/* A row per fact the work actually carries. location, area and services are all optional
				    in the schema, so each row is written as a condition rather than as a blank the
				    reader has to read past. Category, Type and Published are required, so they are
				    always there. */}
				<DetailTable className="mt-size-96">
					{
						place &&
						<DetailTableRow label="Location"><span>{place}</span></DetailTableRow>
					}
					{
						work.area !== null &&
						// The unit lives here rather than in the stored value — see SCHEMA.md.
						<DetailTableRow label="Area"><span>{work.area} m²</span></DetailTableRow>
					}
					<DetailTableRow label="Category">
						<BodyLinkSecondary href={withSearchParams("/work", { category: work.category.slug })}>
							{work.category.name}
						</BodyLinkSecondary>
					</DetailTableRow>
					<DetailTableRow label="Type">
						<BodyLinkSecondary href={withSearchParams("/work", { type: work.type.slug })}>
							{work.type.name}
						</BodyLinkSecondary>
					</DetailTableRow>
					<DetailTableRow label="Published">
						<span>{formatDate(work._createdAt)}</span>
					</DetailTableRow>
					{
						work.services.length > 0 &&
						<DetailTableRow label="Services">
							{work.services.map(service => (
								<ServiceButton key={service._key} service={service} />
							))}
						</DetailTableRow>
					}
				</DetailTable>
			</Section>
			<Gallery images={work.gallery} title={work.title} />
			{/* The reference is optional, and a work without one projects it to null — see the query. */}
			{work.testimonial && <Testimonial testimonial={work.testimonial} />}
			{
				moreWork.length > 0 &&
				<FeaturedWork work={moreWork} heading="More Work" />
			}
		</main>
	)
}
