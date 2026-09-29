import NavLink from "@/components/navigation/NavLink"
import { STATIC_ROUTES } from "@/lib/routes"

// The site's route links, across the top of a page. The navigation landmark: one per document, and
// the only element here that holds links to anywhere — which is why the <nav> is here rather than
// back in Navbar around a logo and a toggle.
//
// Rendered by the page rather than by the layout, because the one thing it cannot work out for
// itself is what colour to be. It used to ride along inside Navbar's mix-blend-difference, which
// answers that question by inverting whatever is behind — fine for a mark, but it leaves words at
// the mercy of the section they happen to be over, and a colour that is decided by accident is a
// colour nobody chose. The page knows what its first screen looks like, so the page says.
//
// absolute, so it belongs to the top of the page and scrolls away with it. Navbar stays fixed; only
// these go. z-5 puts them over a hero's own layers — which run to z-3 — and under the sidebar and
// the transition curtain at z-10 and z-15, so an open menu covers them rather than being read
// through.
//
// A ul, because five route links are a list. Nothing changes on screen: the li's are the flex
// items the anchors used to be.
export default function MainNav(
	{ color = "text-foreground" }: { color?: string }) {
	return (
		<nav
			aria-label="Main"
			className={`absolute left-0 top-0 w-full z-5 grid-standard ${color}`}>
			<ul className="col-start-7 hidden lg:flex col-span-5 gap-size-48 py-size-24">
				{STATIC_ROUTES.map(route => (
					<li key={route.href}>
						<NavLink active href={route.href}>{route.label}</NavLink>
					</li>
				))}
			</ul>
		</nav>
	)
}
