import TextLineSplit from "@/components/animation/TextLineSplit"

export default function Serif64({ children }: { children: React.ReactNode }) {
	return (
		<div className="
			col-start-2 col-span-10
			xl:col-start-3 xl:col-span-8
		">
			<TextLineSplit className="text-size-36 md:text-size-64 font-serif text-center">
				<span className="block text-size-96">“</span>
				{children}
			</TextLineSplit>
		</div>
	)
}
