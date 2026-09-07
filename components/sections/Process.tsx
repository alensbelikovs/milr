import Section from "@/components/general/Section"
import Body36 from "@/components/typography/Body36"
import Body18Container from "@/components/typography/Body18Container"
import Body18 from "@/components/typography/Body18"

const NAV_LABEL = "Process"

export default function Process() {
	return (
		<Section className="relative min-h-[175vh] bg-foreground text-background" label={NAV_LABEL}>
			<Body36 className="self-start">Our time together <br/> Starts with a conversation.</Body36>
			<Body18Container className="self-end">
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
