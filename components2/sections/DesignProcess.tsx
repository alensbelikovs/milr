import SectionTitle from "@/components2/typography/SectionTitle"
import BodyPrimary from "@/components2/typography/BodyPrimary"
import BodySmallPContainer from "@/components2/typography/BodySmallPContainer"
import BodySmallP from "@/components2/typography/BodySmallP"
import PlaceholderPattern from "@/components2/common/PlaceholderPattern"

export default function DesignProcess() {
	return (
		<section>
			<SectionTitle chapter="4" title="Design Process" />
			<BodyPrimary>
				{
					"Our time together starts with an honest conversation. " +
					"I listen closely to your taste, your habits, and what you're " +
					"hoping to feel, and guide it all with years of hands-on design " +
					"thinking, until every idea lands in a space that feels unmistakably yours."
				}
			</BodyPrimary>
			<BodySmallPContainer>
				<BodySmallP>
					{
						"From there, those ideas take shape as 3D renders, " +
						"so you can see exactly how the space will come " +
						"together before anything is built or bought. This is " +
						"also when furniture, finishes, and colors get chosen, " +
						"each one picked to create the specific feeling you're " +
						"after, whether that's a home that feels warm after a long " +
						"day or a workspace that feels productive the moment you walk " +
						"in, all sourced to fit your budget and your taste."
					}
				</BodySmallP>
				<BodySmallP>
					{
						"Once everything is decided, I stay hands-on through installation, " +
						"advising and supervising every step so the finished space " +
						"matches the plan exactly. It's a collaborative process from " +
						"start to finish, and I keep working until the result feels " +
						"every bit as right in person as it did on paper."
					}
				</BodySmallP>
			</BodySmallPContainer>
			<div className="pt-size-96">
				<div className="h-screen relative">
					<PlaceholderPattern />
				</div>
			</div>
		</section>
	)
}
