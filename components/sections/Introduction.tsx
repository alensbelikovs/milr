import Body36 from "@/components/typography/Body36"
import BodyLink from "@/components/actions/BodyLink"
import Body18 from "@/components/typography/Body18"
import Body18Container from "@/components/typography/Body18Container"
import Section from "@/components/general/Section"

const NAV_LABEL = "Intro"

export default function Introduction() {
	return (
		<Section label={NAV_LABEL}>
			<Body36>
				{
					"I am an interior designer creating practical and memorable spaces"
					+ " that compliment routines and stay useful for years to come."
				}
			</Body36>
			<Body18Container>
				<Body18>
					{
						"I believe that great spaces connect emotionally"
						+ " to the people who occupy them. Every project"
						+ " is designed around your habits and taste."
						+ " Whether it's a living room made to foster"
						+ " conversations or an office space that fuels"
						+ " productivity, the outcome is always the same –"
						+ " a space that supports routines and feels right"
						+ " the moment you walk in."
					}
				</Body18>
				<Body18>
					{
						"Every routine, from the stumble to the bathroom at 7"
						+ " in the morning to the glow of a reception light left on, is"
						+ " supported by details most people never think about, but always"
						+ " notice – the color of the light, the warmth of a carpet underfoot,"
						+ " or the placement of a switch exactly where your hand reaches."
						+ " These are the choices that make a space work for the people who"
						+ " live, gather, or do business in it, day after day."
					}
				</Body18>
				<Body18>
					{
						"Design trends come and go, but your home or workplace shouldn't"
						+ " have an expiration date. I choose materials and furniture for"
						+ " how they support your routine and reflect your taste. A design"
						+ " built to impress today is rarely the one you still love five"
						+ " years from now. That is why my work holds up – not because"
						+ " it followed a passing style, but because it was never chasing one."
					}
				</Body18>
				<BodyLink href="/#">Read About Me</BodyLink>
			</Body18Container>
		</Section>
	)
}

Introduction.navLabel = NAV_LABEL
