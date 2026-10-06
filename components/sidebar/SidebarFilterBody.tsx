"use client"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { countWork } from "@/app/work/actions"
import TextMaskReveal from "@/components/animation/TextMaskReveal"
import BodyButton from "@/components/buttons/BodyButton"
import DetailList from "@/components/details/DetailList"
import Loader from "@/components/icons/Loader"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { type WorkFilter } from "@/types/CommonTypes"

// Filters are only staged here; nothing changes on the page until the form is submitted
export default function SidebarFilterBody(
	{ filters, active, count }: {
		filters: { sectors: WorkFilter[], solutions: WorkFilter[] },
		active: { sectors: string[], solutions: string[] },
		count: number
	}) {
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)
	const router = useRouter()
	const firstRender = useRef(true)

	const [sectors, setSectors] = useState(active.sectors)
	const [solutions, setSolutions] = useState(active.solutions)
	const [workCount, setWorkCount] = useState(count)
	const [loading, setLoading] = useState(false)
	const hasActive = active.sectors.length + active.solutions.length > 0
	const hasSelection = hasActive || sectors.length + solutions.length > 0

	const groups = [
		{
			label: "Category",
			options: filters.sectors,
			selected: sectors,
			setSelected: setSectors,
			offset: 0
		},
		{
			label: "Solutions",
			options: filters.solutions,
			selected: solutions,
			setSelected: setSolutions,
			// Solutions start once every category has revealed
			offset: filters.sectors.length
		},
	]

	// The initial count already matches; ignore drops responses for an outdated selection
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false
			return
		}
		let ignore = false
		setLoading(true)
		countWork(sectors, solutions).then(result => {
			if (ignore) return
			setWorkCount(result)
			setLoading(false)
		})
		return () => { ignore = true }
	}, [sectors, solutions])

	// Closed by hand: a query-only change keeps the pathname, so Sidebar won't close itself
	function apply(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const query = new URLSearchParams()
		sectors.forEach(slug => query.append("sectors", slug))
		solutions.forEach(slug => query.append("solutions", slug))
		const href = query.size ? `/work?${query}` : "/work"
		closeSidebar()
		if (href !== window.location.pathname + window.location.search) router.push(href, { scroll: false })
	}

	return (
		<form
			aria-label="Filter work"
			onSubmit={apply}
			className="
				grid grid-cols-6 grid-rows-[1fr_auto] min-h-full
				px-size-24 gap-x-size-24 pt-size-96
			">
			<div className="col-start-2 col-span-4 flex flex-col gap-size-96">
				<TextMaskReveal>
					<button
						type="button"
						disabled={!hasSelection}
						onClick={() => {
							closeSidebar()
							if (hasActive) router.push("/work", { scroll: false })
						}}
						className={`
							text-size-36 text-left
							${hasSelection
								? "hover:underline cursor-pointer"
								: "text-foreground/50 cursor-not-allowed"}
						`}>
						Reset Filters
					</button>
				</TextMaskReveal>
				{groups.map(({ label, options, selected, setSelected, offset }) => (
					<DetailList key={label} label={label}>
						{options.map(({ title, slug }, index) => (
							<li className="my-2" key={slug}>
								<TextMaskReveal delay={(offset + index) * 0.05}>
									<button
										type="button"
										aria-pressed={selected.includes(slug)}
										onClick={() => setSelected(selected.includes(slug)
											? selected.filter(item => item !== slug)
											: [...selected, slug])}
										className={`
											text-size-36 text-left
											hover:underline cursor-pointer transition-colors
											${selected.includes(slug)
												? "text-foreground"
												: "text-foreground/50"}
										`}>
										{title}
									</button>
								</TextMaskReveal>
							</li>
						))}
					</DetailList>
				))}
			</div>
			<div className="
				col-span-full sticky bottom-0
				grid grid-cols-6 gap-x-size-24 py-size-48
				bg-linear-to-t from-background via-background to-transparent
			">
				<div className="col-start-2 col-span-4">
					<BodyButton
						type="submit"
						color="bg-foreground text-background"
						className="w-full"
						aria-busy={loading}
						icon={loading ? <Loader dimensions={12} fill="currentColor" /> : undefined}>
						View {workCount} {workCount === 1 ? "project" : "projects"}
					</BodyButton>
				</div>
			</div>
		</form>
	)
}
