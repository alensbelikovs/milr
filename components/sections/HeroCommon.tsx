import DetailList from "@/components/details/DetailList"
import TextLineSplit from "@/components/animation/TextLineSplit"
import ImageParallax from "@/components/animation/ImageParallax"
import Image from "@/components/media/Image"
import ImageDimmer from "@/components/media/ImageDimmer"
import BodyLink from "@/components/buttons/BodyLink"
import buildImageUrl, { HERO } from "@/utils/buildImageUrl"
import formatDate from "@/utils/formatDate"
import { type CoverType, type WorkCategory, type WorkType } from "@/types/ContentTypes"


// Doesn't use semantic <Section/> component,
// since not included in <SectionNav/>
// and has different styling
//
// category and type arrive whole rather than as names: the name is what the list prints, and the slug
// is what its link needs to open the work index filtered to it.
//
// cover is the picture the band is drawn over, and the band is a band with or without one: left off,
// nothing about this section changes. Which one it is belongs to the page — the home page is drawn
// over the studio's own cover, a work page over that work's lead image — so it is handed in rather
// than fetched, like everything else on a page that gathers its requests in one place.
export default function HeroCommon(
	{ heading, subheading, cover, category, type, published, instant = false }:
		{
			heading: string;
			subheading: string;
			cover?: CoverType;
			category?: WorkCategory;
			type?: WorkType;
			published?: Date;
			instant?: boolean
		}
) {
	return (
		// selection-invert, because this band runs the page's colours the other way round: the
		// default selection would paint a dark block over text that is already light.
		//
		// overflow-hidden for the drift inside: the parallax layer stands a twentieth of its height
		// proud of this box at each end, and unclipped that overhang is extra page to scroll through.
		// bg-foreground stays underneath it — it is what the picture loads onto, and what the band is
		// made of when there is no picture at all.
		<section className="text-background w-full bg-foreground selection-invert grid-standard relative min-h-screen py-size-24 overflow-hidden">
			{
				cover &&
				<>
					<ImageParallax>
						<Image
							src={buildImageUrl(cover.media, HERO)}
							alt={cover.alt ?? ""}
							fill
							sizes="100vw"
							quality={99}
							// Eager, which is the case Image leaves the door open for: it lazy-loads by
							// default because a picture requested near the viewport almost always
							// resolves in front of someone, and this one is already in front of them
							// before anything is scrolled. Waiting for it would hold the largest thing
							// on the page behind a request that had not been made yet.
							loading="eager"
							className="object-cover" />
					</ImageParallax>
					{/* The site's one wash, so light type stays readable over whatever was uploaded. A
					    sibling of the picture rather than a class on it, because the picture moves. */}
					<ImageDimmer />
				</>
			}
			{/* Both rendered through the splitter, which puts out the same h1 and h2 with the same
			    classes — they stay the grid items they were, and the lines it cuts live inside them.

			    relative on both, so the type paints over the two layers above rather than under them:
			    a positioned box outranks an in-flow one whatever the source order says. */}
			<TextLineSplit
				as="h1"
				className="text-size-72 row-start-1 col-span-full lg:col-span-6 self-center relative"
				instant={instant}>
				{heading}
			</TextLineSplit>
			<TextLineSplit
				as="h2"
				className="text-size-24 self-center relative
				col-start-7 col-span-6
				sm:col-start-7 sm:col-span-5
				md:col-start-7 md:col-span-4
				lg:col-start-7 lg:col-span-3
				xl:col-start-7 xl:col-span-3
				2xl:col-start-7 2xl:col-span-2"
				instant={instant}>
				{subheading}
			</TextLineSplit>
		</section>
	)
}
