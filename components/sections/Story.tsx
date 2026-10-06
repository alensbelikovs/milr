import Section from "@/components/layout/Section"
import Body18 from "@/components/typography/Body18"
import Body18Container from "@/components/typography/Body18Container"
import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"

const NAV_LABEL = "My Story"

export default function Story() {
	return (
		<Section className="pt-size-48 md:pt-size-96 lg:pt-size-192 pb-size-192" label={NAV_LABEL}>
			<Body36Container>
				<Body36>
					I am an interior designer crafting homes and workspaces with one ambition in mind –
					to understand how you want to feel and move through your space, and shape it into
					somewhere you belong to.
				</Body36>
			</Body36Container>
			<Body18Container>
				<Body18>
					Before this became my work, I spent nine years studying design, three of them focused
					specifically on interiors, while working a regular 9-5 job.
				</Body18>
				<Body18>
					It was during that time I noticed how much the spaces around me shaped my days without
					me realizing it – a desk in the wrong spot, lighting that made focusing harder than it
					should&apos;ve been, or a living room that looked cozy but never quite felt like home.
					Those small daily frustrations are a big part of why I pursued interior design.
				</Body18>
				<Body18>
					Now, I design homes and workspaces across widely different projects, from family
					residences to growing businesses, and I approach each one with the same care for the
					people who will spend their days there.
				</Body18>
				<Body18>
					I start by understanding your habits and what you want to feel when you&apos;re in that
					space. Then I build the layout around your day. Once that&apos;s right, I work on the
					atmosphere: the light, the materials, the tone that helps you focus or helps you unwind.
				</Body18>
				<Body18>
					I don&apos;t chase trends, because a design that only looks good today isn&apos;t a design
					worth having. Every material and piece of furniture is chosen to hold up, both physically
					and stylistically, so a space stays just as useful and just as compelling years after
					it&apos;s finished, not just on the day the last piece is installed.
				</Body18>
				<Body18>
					Looking ahead, I want to keep taking on projects that challenge me in new ways. In my work
					I am determined to prove that a space can be both practical and memorable to you, without
					ever needing to choose between the two.
				</Body18>
			</Body18Container>
		</Section>
	)
}

Story.navLabel = NAV_LABEL
