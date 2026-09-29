import Section from "@/components/layout/Section"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import WorkGrid from "@/components/cards/WorkGrid"
import Body36Secondary from "@/components/typography/Body36Secondary"
import BodyLink from "@/components/buttons/BodyLink"
import Body36SecondaryContainer from "@/components/typography/Body36SecondaryContainer"
import { type WorkListType } from "@/types/ContentTypes"

const NAV_LABEL = "Best Work"

// heading only changes the words above the grid, never the label the Section is given. The label is
// the section's id and it has to keep matching navLabel below — that property is static, so a page
// nav built from it would point at an id that moved. Defaulted to NAV_LABEL so the two cannot drift
// apart where nothing overrides it.
//
// showMore renders the closing copy and its link through to the full list of work. On by default;
// a work page turns it off, since the reader is already inside the work section the link leads to.
//
// The work is handed in rather than fetched here. A section that fetches is a section that cannot be
// awaited alongside anything else: its request only starts once React reaches it in the tree, so two
// such sections on one page go one after the other. The page gathers everything in a single
// Promise.all instead and passes the results down.
//
// It also fixes a quieter problem. SectionNavWrapper reads navLabel off the ELEMENT, not off what
// the element renders, so a section that fetched its own data and returned null for an empty result
// still put a link in the nav — pointing at an id that was never rendered. Deciding at the page, with
// the data already in hand, is what keeps the nav honest.
export default function FeaturedWork(
	{ work, heading = NAV_LABEL, showMore = true }:
		{ work: WorkListType[]; heading?: string; showMore?: boolean }) {
	return (
		<Section className="py-size-192" label={NAV_LABEL}>
			<Body36Container className="mb-size-24">
				<Body36 serif={`( ${work.length} + )`}>{heading}</Body36>
			</Body36Container>
			<WorkGrid work={work} />
			<Body36SecondaryContainer>
				<Body36Secondary>
					{
						"Every space is shaped around a real routine,"
						+ " built to feel as good as it functions."
					}
				</Body36Secondary>
				<BodyLink href="/work">All Work</BodyLink>
			</Body36SecondaryContainer>
		</Section>
	)
}

// Read by SectionNavWrapper to build this section's nav link. Declared on the
// component so a page can compose sections without restating their names.
FeaturedWork.navLabel = NAV_LABEL
