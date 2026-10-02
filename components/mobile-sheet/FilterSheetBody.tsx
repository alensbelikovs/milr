"use client"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useMobileSheetStore } from "@/store/MobileSheetStore"
import MobileSheetBody from "@/components/mobile-sheet/MobileSheetBody"
import DetailList from "@/components/details/DetailList"
import BodyButton from "@/components/buttons/BodyButton"
import clickChangesNothing from "@/utils/clickChangesNothing"
import withSearchParams from "@/utils/withSearchParams"
import { type WorkCategory, type WorkType } from "@/types/ContentTypes"
import Plus from "@/components/icons/Plus"

type Option = { slug: string | null; label: string }

// FilterNav for the mobile sheet. Unlike the bar, picking here only stages a choice: a category and a
// type are chosen together and sent once, with Apply, rather than costing a page transition each.
//
// A form, because that is what this is — choices and a submit. The options are toggle buttons rather
// than links for the same reason: pressing one goes nowhere until Apply does.
export default function FilterSheetBody(
	{ categories, types, activeCategory, activeType }: {
		categories: WorkCategory[]
		types: WorkType[]
		activeCategory: string | null
		activeType: string | null
	}
) {
	const close = useMobileSheetStore(state => state.close)
	const router = useRouter()

	const [category, setCategory] = useState(activeCategory)
	const [type, setType] = useState(activeType)

	// Drops the page along with the old filters, the same as FilterNav's links: page 3 of one set is
	// not a place in another. scroll off because TransitionControl does the scrolling, under the
	// curtain. Applying what is already showing only closes the sheet — see clickChangesNothing.
	function apply(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const href = withSearchParams("/work", { category, type })
		close()
		if (!clickChangesNothing(href)) router.push(href, { scroll: false })
	}

	// Goes by what is applied, not by what is staged: the page only needs asking again if it is
	// actually showing a filter. With none applied, clearing is just a way out of the sheet.
	function clear() {
		close()
		if (activeCategory || activeType) router.push("/work", { scroll: false })
	}

	const optionList = (
		label: string,
		options: Option[],
		selected: string | null,
		select: (slug: string | null) => void,
	) => (
		<div className="col-start-2 col-span-4">
			<DetailList label={label}>
				{options.map(({ slug, label }) => (
					<li className="my-2" key={slug ?? "all"}>
						<button
							type="button"
							aria-pressed={slug === selected}
							onClick={() => select(slug)}
							className={`text-size-36 hover:underline cursor-pointer text-left transition-colors
								${slug === selected ? "text-current" : "text-current/50"}`}>
							{label}
						</button>
					</li>
				))}
			</DetailList>
		</div>
	)

	return (
		<MobileSheetBody
			as="form"
			aria-label="Filter work"
			onSubmit={apply}
			footer={
				<BodyButton
					type="submit"
					icon={<Plus dimensions={14} fill="currentColor" />}
					color="bg-foreground text-background"
					className="w-full">
					Apply
				</BodyButton>
			}>
			{optionList(
				"Category",
				[{ slug: null, label: "All Categories" }, ...categories.map(c => ({ slug: c.slug, label: c.name }))],
				category,
				setCategory,
			)}
			{optionList(
				"Type",
				[{ slug: null, label: "All Types" }, ...types.map(t => ({ slug: t.slug, label: t.name }))],
				type,
				setType,
			)}
			{/* type="button": it acts on its own rather than submitting the staged choice. */}
			<div className="col-start-2 col-span-4">
				<button
					type="button"
					onClick={clear}
					className="text-size-36 hover:underline cursor-pointer text-left">
					Clear Filters
				</button>
			</div>
		</MobileSheetBody>
	)
}
