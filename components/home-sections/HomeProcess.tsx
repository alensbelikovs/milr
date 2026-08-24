import TextLineSplit from "@/components/common/TextLineSplit"
import PaintScene from "@/components/paint-scene/PaintScene"

export default function HomeProcess() {
	return (
		<section className="flex pt-section flex-col">
			<div className="grid grid-cols-12 gap-regular px-regular">
				<div 
				className="
					col-span-11
					md:col-span-9 md:col-start-2
					lg:col-span-6 xl:col-span-5 lg:col-start-2 xl:col-start-2
					flex flex-col gap-normal-2
					mb-section
				"
				>
					<TextLineSplit as="p" className="text-subheading">
						{
							"During the process, each and every decision is yours. " 
							+ "Guided by your taste, habits, and my experience, " 
							+ "we shape an interior that functions well and represents you."
						}
					</TextLineSplit>
				</div>
			</div>
			<div className="grid grid-cols-12 px-regular gap-regular pb-normal-3">
				<div 
				className="
					flex flex-col gap-normal-2 font-serif text-body-2
					col-start-1 col-span-full 
					md:col-span-7 md:col-start-5
					lg:col-span-5 lg:col-start-7
					xl:col-span-4 xl:col-start-8
				"
				>
					<p>
						{
							"Our time together starts with a discovery call, " 
							+ "where I get to know your needs, your routines, and the mood you "
							+ "want your space to hold. From there, I sketch rough ideas and shape " 
							+ "a layout around what you've shared, mapping out your core needs so the " 
							+ "space works the way you actually live or work in it."
						}
					</p>
					<p>
						{
							"Next, those rough sketches get refined into 3D renders, so you can see " 
							+ "how everything comes together before anything is built or bought. " 
							+ "This is also where furniture, finishes, and colors are chosen, " 
							+ "all picked to create the exact feeling you're after, whether that's a " 
							+ "home that feels warm after a long day or a workspace that feels " 
							+ "productive the moment you walk in. Every piece is sourced to fit " 
							+ "your budget and your taste."
						}
					</p>
					<p>
						{
							"Once the plan is set, I stay involved through installation, " 
							+ "advising and supervising to make sure the finished space matches " 
							+ "the design. The process stays collaborative from start to " 
							+ "finish, so the end result reflects you. I keep working until " 
							+ "the space is exactly how you imagined it."
						}
					</p>
				</div>
			</div>
			<PaintScene id="process-paint-scene" srcAfter="/placeholder.png" srcBefore="/placeholder2.png"/>
		</section>
	)
}