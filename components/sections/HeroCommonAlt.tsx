import Section from "@/components/layout/Section"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import Heading128 from "@/components/typography/Heading128"

// A centered heading over a tall dark panel; not a nav section
export default function HeroCommonAlt({ heading }: { heading: React.ReactNode }) {
	return (
		<Section className="pt-size-192">
			<div className="col-span-full mb-size-192">
				<Heading128 mainHeading>{heading}</Heading128>
			</div>
			{/* Negative margin cancels the grid's side padding, so the panel runs edge to edge */}
			<div className="
				col-span-full -mx-size-24
				min-h-screen lg:min-h-[175vh]
				bg-foreground cursor-pointer
			">
				<PointerOverlayTrigger label="Paint" toggledLabel="Clear" />
			</div>
		</Section>
	)
}
