import NavLink from "@/components/navigation/NavLink"
import { getDictionary } from "@/lib/dictionaries"
import { STATIC_ROUTES } from "@/lib/routes"

// Route links across the top of a page; the page picks the color that suits its first screen
export default async function MainNav({ color }: { color: string }) {
	const dict = await getDictionary()

	return (
		<nav aria-label="Main" className={`absolute left-0 top-0 w-full z-5 grid-standard ${color}`}>
			<ul className="col-start-7 col-span-5 hidden lg:flex gap-size-48 py-size-24">
				{STATIC_ROUTES.map(route => (
					<li key={route.href}>
						<NavLink href={route.href}>{dict.nav[route.key]}</NavLink>
					</li>
				))}
			</ul>
		</nav>
	)
}
