import Body36 from "@/components/typography/Body36"
import Body36Container from "@/components/typography/Body36Container"
import BodyLink from "@/components/buttons/BodyLink"
import Body18 from "@/components/typography/Body18"
import Body18Container from "@/components/typography/Body18Container"
import Section from "@/components/layout/Section"
import TextBlockReveal from "@/components/animation/TextBlockReveal"

const NAV_LABEL = "Intro"

export default function Introduction() {
	return (
		<Section className="pt-size-48 md:pt-size-96 lg:pt-size-192 pb-size-192" label={NAV_LABEL}>
			<Body36Container>
				<Body36>
					{
						"I am an interior designer creating practical and memorable spaces"
						+ " that compliment routines and stay useful for years to come."
					}
				</Body36>
			</Body36Container>
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
				<TextBlockReveal as="div" className="w-full">
					<BodyLink className="w-full" href="/about">My Story</BodyLink>
				</TextBlockReveal>
			</Body18Container>
		</Section>
	)
}

Introduction.navLabel = NAV_LABEL
