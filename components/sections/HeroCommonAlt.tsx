import DetailList from "@/components/details/DetailList"
import BodyLink from "@/components/buttons/BodyLink"
import Heading128 from "@/components/typography/Heading128"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"

// Doesn't use semantic <Section/> component,
// since not included in <SectionNav/>
// and has different styling
export default function HeroCommonAlt(
	{ heading, media }:
		{
			heading: React.ReactNode;
			media?: string
		}
) {
	return (
		<section className="pt-size-192">
			<div className="grid-standard mb-size-192"><Heading128 mainHeading>{heading}</Heading128></div>
			{/* cursor-pointer across the whole panel, because the whole panel is what a click acts
			    on — there is no smaller target to aim at. The label names what the next click does,
			    so it alternates: Paint until it has been painted on, Clear until it is wiped. */}
			<div className="min-h-screen lg:min-h-[175vh] bg-foreground col-span-full cursor-pointer">
				<PointerOverlayTrigger label="Paint" toggledLabel="Clear" />
			</div>
		</section>
	)
}
