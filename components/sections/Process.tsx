import Section from "@/components/layout/Section"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import Body18 from "@/components/typography/Body18"
import Body18Container from "@/components/typography/Body18Container"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"

const NAV_LABEL = "Process"

// A dark band the reader can click to paint on; the copy keeps a text cursor so it stays selectable
export default function Process() {
	return (
		<Section
			label={NAV_LABEL}
			className="
				relative min-h-screen lg:min-h-[175vh] py-size-192
				bg-foreground text-background selection-invert cursor-pointer
			">
			<PointerOverlayTrigger label="Paint" toggledLabel="Clear" />
			<Body36Container className="self-start relative z-1 cursor-text">
				<Body36>Our time together <br /> Starts with a conversation.</Body36>
			</Body36Container>
			<Body18Container collapse={false} className="self-end relative z-1 cursor-text">
				<Body18>
					I listen closely to your taste, your habits, and what you&apos;re hoping to feel, then
					guide it all with years of hands-on design thinking, until every idea lands in a space
					that feels unmistakably yours.
				</Body18>
				<Body18>
					From there, ideas take shape as 3D renders, so you can see the space before anything
					is built or bought. Furniture, finishes, and colors get chosen next, each picked to fit
					the feeling you&apos;re after, your budget, and your taste.
				</Body18>
				<Body18>
					I stay hands-on through installation, making sure the finished space matches the plan.
					It&apos;s a collaborative process, and I keep working until it feels every bit as right
					in person as it did on paper.
				</Body18>
			</Body18Container>
		</Section>
	)
}

Process.navLabel = NAV_LABEL
