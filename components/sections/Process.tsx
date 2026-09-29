import Section from "@/components/layout/Section"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import Body18Container from "@/components/typography/Body18Container"
import Body18 from "@/components/typography/Body18"
import PointerOverlayTrigger from "@/components/pointer/PointerOverlayTrigger"

const NAV_LABEL = "Process"

export default function Process() {
	return (
		// cursor-pointer across the whole band, because the whole band is what a click acts on —
		// there is no smaller target to aim at, so the pointer has to say so everywhere.
		//
		// selection-invert for the same reason the hero carries it: the copy sits light on the band's
		// dark ground, and the page's default selection would paint a dark block straight over it.
		<Section
			className="relative min-h-screen py-size-192 lg:min-h-[175vh] bg-foreground text-background selection-invert cursor-pointer"
			label={NAV_LABEL}>
			{/* Listens on the section it sits in. A client component inside a server one, which is
			    all it needs to be — this section stays server-rendered.
			    The label names what a click does next, so it alternates: Paint until the section has
			    been painted on, Clear until it is wiped. */}
			<PointerOverlayTrigger label="Paint" toggledLabel="Clear" />
			{/* The copy is lifted over whatever the band draws behind it and keeps a text cursor of
			    its own: the band's cursor-pointer would otherwise say the words cannot be taken, and
			    a reader who wants to quote a line should be able to drag across it as usual. */}
			<Body36Container className="self-start relative z-1 cursor-text">
				<Body36>Our time together <br/> Starts with a conversation.</Body36>
			</Body36Container>
			<Body18Container collapse={false} className="self-end relative z-1 cursor-text" fadeClassName="to-foreground">
				<Body18>
					{
						"I listen closely to your taste, your habits,"
						+ " and what you're hoping to feel, then guide it all with"
						+ " years of hands-on design thinking, until every idea"
						+ " lands in a space that feels unmistakably yours."
					}
				</Body18>
				<Body18>
					{
						"From there, ideas take shape as 3D renders,"
						+ " so you can see the space before anything is built"
						+ " or bought. Furniture, finishes, and colors get chosen"
						+ " next, each picked to fit the feeling you're after,"
						+ " your budget, and your taste."
					}
				</Body18>
				<Body18>
					{
						"I stay hands-on through installation, making sure"
						+ " the finished space matches the plan. It's a collaborative"
						+ " process, and I keep working until it feels every bit as"
						+ " right in person as it did on paper."
					}
				</Body18>
			</Body18Container>
		</Section>
	)
}

Process.navLabel = NAV_LABEL
