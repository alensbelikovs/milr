import SectionTitle from "@/components2/typography/SectionTitle"
import BodyPrimary from "@/components2/typography/BodyPrimary"
import BodySmallPContainer from "@/components2/typography/BodySmallPContainer"
import BodySmallP from "@/components2/typography/BodySmallP"
import BodyLink from "@/components2/actions/BodyLink"

export default function AboutIntro() {
	return (
		<section>
			<SectionTitle chapter="1" title="Introduction" />
			<BodyPrimary>
				{
					"I am an interior designer creating practical " +
					"and memorable spaces that compliment " +
					"routines and stay useful for years to come."
				}
			</BodyPrimary>
			<BodySmallPContainer>
				<BodySmallP>
					{
						"I design homes and commercial spaces that are " +
						"built around one thing: how you actually live " +
						"and work. From newlyweds furnishing their first " +
						"home to a beauty salon shaping how clients " +
						"experience every visit, my work starts with your " +
						"routine, studying how you move through your day " +
						"and what matters for you before I mark out a " +
						"single layout. Whether that's a completely new " +
						"space or an existing interior refined with " +
						"details that build on what's already there, " +
						"practicality comes before anything else."
					}
				</BodySmallP>
				<BodySmallP>
					{
						"Once the space is functional, I turn to " +
						"atmosphere: the color of the light, the materials " +
						"underfoot, the tone of a room that either helps " +
						"you focus or helps you switch off after a long " +
						"day. These are the small details most people " +
						"never think to question, but always notice. I " +
						"don't chase trends, because a design that only " +
						"looks good today isn't a design worth having. " +
						"Every material and piece of furniture is chosen " +
						"to build a feeling and support the way you live, " +
						"not to follow a passing style, so the space stays " +
						"just as compelling years from now as it is the " +
						"day it's finished."
					}
				</BodySmallP>
			</BodySmallPContainer>
		</section>
	)
}
