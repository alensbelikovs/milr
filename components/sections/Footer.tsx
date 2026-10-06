import Link from "next/link"
import DetailList from "@/components/details/DetailList"
import DetailListAddress from "@/components/details/DetailListAddress"
import DetailListContacts from "@/components/details/DetailListContacts"
import DetailListHours from "@/components/details/DetailListHours"
import DetailListSocials from "@/components/details/DetailListSocials"
import { STATIC_ROUTES } from "@/lib/routes"

export default function Footer() {
	return (
		<footer className="
			grid-standard gap-y-size-96 py-size-96 min-h-screen
			bg-foreground text-background
		">
			<div className="col-start-2 col-span-10 flex flex-col gap-size-96">
				<DetailList label="Navigation">
					{STATIC_ROUTES.map(route => (
						<li className="my-1.5" key={route.href}>
							<Link className="text-size-24 hover:underline" href={route.href}>
								{route.label}
							</Link>
						</li>
					))}
				</DetailList>
				<div className="flex gap-size-24 mt-size-96">
					<DetailListContacts className="w-full" />
					<DetailListSocials className="w-full" />
					<DetailListAddress className="w-full" />
					<DetailListHours className="w-full" />
				</div>
				<div className="flex w-full gap-size-24 pt-size-24 text-body-16 text-background/50">
					<p className="w-full">Rinalds Miļicins</p>
					<p className="w-full">Milr Studio</p>
					<p className="w-full text-right">
						<Link className="hover:underline" href="/cookies-privacy">Cookies & Privacy</Link>
					</p>
					<p className="w-full text-right">
						<Link className="hover:underline" target="_blank" href="/cookies-privacy">
							Designed by AB
						</Link>
					</p>
				</div>
			</div>
		</footer>
	)
}
