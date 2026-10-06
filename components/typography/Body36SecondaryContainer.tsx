export default function Body36SecondaryContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="
			col-start-3 col-span-8
			md:col-start-7 md:col-span-5
			lg:col-start-7 lg:col-span-4
			xl:col-start-7 xl:col-span-3
			text-center items-center
			md:text-left md:items-start
			flex flex-col gap-size-48 mt-size-192
		">
			{children}
		</div>
	)
}
