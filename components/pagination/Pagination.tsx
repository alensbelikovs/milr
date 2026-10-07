import { type LinkProps } from "next/link"
import Link from "@/components/navigation/LocaleLink"
import { getDictionary } from "@/lib/dictionaries"

// Page links that keep the current search params, e.g. 1 … 3 (4) 5 … 7
export default async function Pagination(
	{ currentPage, totalPages, pathname, searchParams }: {
		currentPage: number,
		totalPages: number,
		pathname: string,
		searchParams: Record<string, string | string[] | undefined>
	}) {
	if (totalPages <= 1) return null
	const { pagination } = await getDictionary()

	const hrefTo = (page: number) => ({ pathname, query: { ...searchParams, page } })

	// A window of three pages around the current one, with the first and last always shown
	const start = currentPage === 1
		? 1
		: currentPage === totalPages ? Math.max(1, totalPages - 2) : currentPage - 1
	const end = Math.min(start + 2, totalPages)
	const steps: (number | "gap")[] = []
	if (start > 1) steps.push(1)
	if (start > 2) steps.push("gap")
	for (let page = start; page <= end; page++) steps.push(page)
	if (end + 1 < totalPages) steps.push("gap")
	if (end < totalPages) steps.push(totalPages)

	return (
		<nav
			aria-label={pagination.label}
			className="col-start-5 col-span-4 flex flex-col justify-center gap-size-24 mt-size-96">
			<div className="flex items-center w-full justify-center">
				{steps.map((step, index) =>
					step === "gap"
						? <span
							key={`gap-${index}`}
							aria-hidden="true"
							className="font-serif p-size-16 text-size-18 text-current/50">
							…
						</span>
						: step === currentPage
							? <span
								key={step}
								aria-current="page"
								className="font-serif p-size-16 text-size-18 underline">
								{step}
							</span>
							: <Link
								key={step}
								href={hrefTo(step)}
								scroll={false}
								className="font-serif p-size-16 text-size-18 text-current/50 hover:underline">
								{step}
							</Link>
				)}
			</div>
			<div className="w-full flex justify-between gap-size-48">
				<FlipLink href={currentPage > 1 ? hrefTo(currentPage - 1) : null}>{pagination.prev}</FlipLink>
				<FlipLink href={currentPage < totalPages ? hrefTo(currentPage + 1) : null}>{pagination.next}</FlipLink>
			</div>
		</nav>
	)
}

function FlipLink({ href, children }: { href: LinkProps["href"] | null, children: React.ReactNode }) {
	if (!href) return <span className="text-size-36 text-current/25">{children}</span>

	return (
		<Link href={href} scroll={false} className="text-size-36 hover:underline">
			{children}
		</Link>
	)
}
