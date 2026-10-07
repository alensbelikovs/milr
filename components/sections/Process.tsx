import Section from "@/components/layout/Section"
import { type NavId } from "@/components/navigation/SectionNavWrapper"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"
import Body18 from "@/components/typography/Body18"
import Body18Container from "@/components/typography/Body18Container"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import Lines from "@/components/typography/Lines"
import { getDictionary } from "@/lib/dictionaries"

const NAV_ID: NavId = "process"

// A dark band the reader can click to paint on; the copy keeps a text cursor so it stays selectable
export default async function Process() {
	const dict = await getDictionary()
	const { process } = dict.home

	return (
		<Section
			navId={NAV_ID}
			className="
				relative min-h-screen lg:min-h-[175vh]
				bg-foreground text-background selection-invert cursor-pointer
			">
			<PointerOverlayTrigger label={dict.common.paint} toggledLabel={dict.common.clear} />
			<Body36Container className="self-start relative z-1 cursor-text">
				<Body36><Lines lines={process.heading} /></Body36>
			</Body36Container>
			<Body18Container collapse={false} className="self-end relative z-1 cursor-text">
				{process.paragraphs.map((paragraph, index) => <Body18 key={index}>{paragraph}</Body18>)}
			</Body18Container>
		</Section>
	)
}

Process.navId = NAV_ID
