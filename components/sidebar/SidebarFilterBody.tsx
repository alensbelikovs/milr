"use client"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { countWork } from "@/app/[lang]/work/actions"
import TextMaskReveal from "@/components/animation/TextMaskReveal"
import BodyButton from "@/components/buttons/BodyButton"
import DetailList from "@/components/details/DetailList"
import Loader from "@/components/icons/Loader"
import { useSite } from "@/components/layout/SiteProvider"
import SidebarFooter from "@/components/sidebar/SidebarFooter"
import { INTL_LOCALES } from "@/lib/i18n"
import { useSidebarContentStore } from "@/store/SidebarContentStore"
import { type WorkFilter } from "@/types/CommonTypes"

// Filters are only staged here; nothing changes on the page until the form is submitted
export default function SidebarFilterBody(
	{ filters, active, count }: {
		filters: { sectors: WorkFilter[], solutions: WorkFilter[] },
		active: { sectors: string[], solutions: string[], featured: boolean },
		count: number
	}) {
	const { lang, dict } = useSite()
	const closeSidebar = useSidebarContentStore(state => state.closeSidebar)
	const router = useRouter()
	const firstRender = useRef(true)

	const [sectors, setSectors] = useState(active.sectors)
	const [solutions, setSolutions] = useState(active.solutions)
	const [featured, setFeatured] = useState(active.featured)
	const [workCount, setWorkCount] = useState(count)
	const [loading, setLoading] = useState(false)
	// Latvian has its own rule for one (21, 31…) and zero (0, 10–20…)
	const plural = new Intl.PluralRules(INTL_LOCALES[lang])
	const viewProjects: Record<string, string> = dict.work.viewProjects
	const hasActive = active.sectors.length + active.solutions.length > 0 || active.featured
	const hasSelection = hasActive || sectors.length + solutions.length > 0 || featured

	// Only one sector at a time; solutions add up, as a work must have them all.
	// Offsets start the reveal after Featured, then after every sector.
	const groups = [
		{
			label: dict.work.sectors,
			options: filters.sectors,
			selected: sectors,
			setSelected: setSectors,
			multiple: false,
			offset: 1
		},
		{
			label: dict.work.solutions,
			options: filters.solutions,
			selected: solutions,
			setSelected: setSolutions,
			multiple: true,
			offset: 1 + filters.sectors.length
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
		countWork(sectors, solutions, featured).then(result => {
			if (ignore) return
			setWorkCount(result)
			setLoading(false)
		})
		return () => { ignore = true }
	}, [sectors, solutions, featured])

	// Closed by hand: a query-only change keeps the pathname, so Sidebar won't close itself
	function apply(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const query = new URLSearchParams()
		sectors.forEach(slug => query.append("sectors", slug))
		solutions.forEach(slug => query.append("solutions", slug))
		if (featured) query.append("featured", "true")
		const href = query.size ? `/${lang}/work?${query}` : `/${lang}/work`
		closeSidebar()
		if (href !== window.location.pathname + window.location.search) router.push(href, { scroll: false })
	}

	return (
		<form
			aria-label={dict.work.filterLabel}
			onSubmit={apply}
			className="
				grid grid-cols-6 grid-rows-[1fr_auto] min-h-full
				px-size-24 gap-x-size-24 pt-size-96
			">
			<div className="col-start-2 col-span-4 flex flex-col gap-size-96">
				<div className="flex flex-col gap-size-16">
					<TextMaskReveal onMount>
						<button
							type="button"
							disabled={!hasSelection}
							onClick={() => {
								closeSidebar()
								if (hasActive) router.push(`/${lang}/work`, { scroll: false })
							}}
							className={`
								text-size-36 text-left
								${hasSelection
									? "hover:underline cursor-pointer"
									: "text-foreground/50 cursor-not-allowed"}
							`}>
							{dict.work.resetAll}
						</button>
					</TextMaskReveal>
					<TextMaskReveal onMount delay={0.05}>
						<button
							type="button"
							aria-pressed={featured}
							onClick={() => setFeatured(!featured)}
							className={`
								text-size-36 text-left
								hover:underline cursor-pointer transition-colors
								${featured ? "text-foreground" : "text-foreground/50"}
							`}>
							{dict.work.featured}
						</button>
					</TextMaskReveal>
				</div>
				{groups.map(({ label, options, selected, setSelected, multiple, offset }) => (
					<DetailList key={label} label={label}>
						{options.map(({ title, slug }, index) => (
							<li className="my-2" key={slug}>
								<TextMaskReveal onMount delay={(offset + index) * 0.05}>
									<button
										type="button"
										aria-pressed={selected.includes(slug)}
										onClick={() => setSelected(selected.includes(slug)
											? selected.filter(item => item !== slug)
											: multiple ? [...selected, slug] : [slug])}
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
			<SidebarFooter>
				<BodyButton
					type="submit"
					color="bg-foreground text-background"
					className="w-full"
					aria-busy={loading}
					icon={loading ? <Loader dimensions={12} fill="currentColor" /> : undefined}>
					{viewProjects[plural.select(workCount)].replace("{count}", String(workCount))}
				</BodyButton>
			</SidebarFooter>
		</form>
	)
}
