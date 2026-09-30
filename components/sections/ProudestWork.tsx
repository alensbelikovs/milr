import Image from "@/components/media/Image"
import Link from "next/link"
import ImageParallax from "@/components/animation/ImageParallax"
import ImageDimmer from "@/components/media/ImageDimmer"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import buildImageUrl, { HERO } from "@/utils/buildImageUrl"
import { type ProudestWorkType } from "@/types/ContentTypes"
import BodyLink from "@/components/buttons/BodyLink"

// The band the work index features one piece in, between its two grids.
//
// The drift is ImageParallax's, the same wrapper the page heroes are drawn over — a band and a hero
// are the same idea at different sizes, and two hand-written versions of one effect are two things
// to keep in step every time the effect is touched. It owns the tween, the trigger and the overhang
// the travel needs; everything here has to do is give it a positioned box that clips, which this
// band already was.
//
// Not a client component any more, and that is the wrapper's doing: the GSAP that used to live here
// is the only thing that needed the boundary. Now it sits one level down, inside the one element
// that actually animates, and everything around it — the link, the copy, the wash — is server-
// rendered again.
export default function ProudestWork({ work }: { work: ProudestWorkType | null }) {
	// Nothing to show and nowhere to go: no slug to link to and no picture to move. Rendering the
	// band anyway would put a screen-tall hole in the page between the two halves of the grid.
	if (!work) return null
	const { cover, slug } = work

	return (
		<div
			className="h-screen lg:h-[125vh] w-full relative
			cursor-pointer
			overflow-hidden grid-standard
			max-lg:grid-rows-[auto_1fr]
			my-size-288
			py-size-120
			bg-foreground text-background">
			<ImageParallax>
				<Image
					src={buildImageUrl(cover.media, HERO)}
					// The editor's own words when there are any, and nothing when there are not: the
					// link over this picture is already named by the copy beside it, so an unwritten
					// alt leaves a background as a background rather than inventing a description
					// for it.
					alt={cover.alt ?? ""}
					fill
					sizes="100vw"
					quality={99}
					// Our own Image, which holds the picture back and reveals it once the file is
					// decoded. It animates the img itself, while the drift around it animates the box
					// — two transforms, two elements, neither fighting the other.
					className="object-cover" />
			</ImageParallax>
			{/* Outside the drifting layer, so it covers the band rather than travelling with the
			    picture — and after it, which is what puts it on top. */}
			<ImageDimmer />
			{/* Draws nothing here — it marks this band as one that wants the layout's pointer
			    label, and listens on the band for the hover that opens it. */}
			<PointerOverlayTrigger />
			{/* The copy has to be lifted over the two absolute layers above: positioned elements
			    paint above in-flow content whatever the source order says, so without a stacking
			    of its own the text sits behind the picture it is written across. Above lg the line
			    split's transforms happen to lift it anyway; below lg nothing is split, and this
			    class is all that does. z-1 and no higher: over the picture and the wash, still under
			    the band's link, so a tap on the words is a tap on the link. */}
			<Body36Container className="relative z-1">
				<Body36>My Proudest Work</Body36>
			</Body36Container>
			{/* Below lg the heading takes the band's first row and this the rest of it, sat at its
			    foot. Columns are HeroCommon's subheading's, breakpoint for breakpoint, so the link
			    lines up with the column the heroes put their second line in. The row wrapper only
			    goes flex at lg, where it is what keeps the link to the width of its label; below it,
			    a plain block lets the link's own w-full reach the column's edges. */}
			<div className={`
				col-start-7 col-span-6
				sm:col-start-7 sm:col-span-5
				md:col-start-7 md:col-span-4
				lg:col-start-7 lg:col-span-3
				xl:col-start-7 xl:col-span-3
				2xl:col-start-7 2xl:col-span-2
				lg:hidden
				max-lg:self-end
				flex flex-col gap-size-64 relative z-5`}>
				<div className="">
					<BodyLink
						color="bg-foreground text-background hover:text-foreground hover:bg-background"
						href={`/work/${slug}`}>View Project</BodyLink>
				</div>
			</div>
			{/* The whole band is the link, so it is one target rather than a line of text inside a
			    box that also looks clickable. Last and highest on purpose: over the copy as well as
			    the picture, so a click on the words is still a click on the link. Nothing to see
			    through it, so the copy stays legible underneath. */}
			<Link href={`/work/${slug}`} className="absolute inset-0 z-2" />
		</div>
	)
}
