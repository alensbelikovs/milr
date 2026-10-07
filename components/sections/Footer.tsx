import Link from "@/components/navigation/LocaleLink"
import ConsentSettingsButton from "@/components/consent/ConsentSettingsButton"
import DetailList from "@/components/details/DetailList"
import DetailListAddress from "@/components/details/DetailListAddress"
import DetailListContacts from "@/components/details/DetailListContacts"
import DetailListHours from "@/components/details/DetailListHours"
import DetailListSocials from "@/components/details/DetailListSocials"
import { getDictionary } from "@/lib/dictionaries"
import { STATIC_ROUTES } from "@/lib/routes"

export default async function Footer() {
	const dict = await getDictionary()

	return (
		<footer className="
			grid-standard gap-y-size-96 py-size-96 min-h-screen
			bg-foreground text-background
		">
			<div className="col-start-2 col-span-10 flex flex-col gap-size-96">
				<DetailList label={dict.common.navigation}>
					{STATIC_ROUTES.map(route => (
						<li className="my-1.5" key={route.href}>
							<Link className="text-size-24 hover:underline" href={route.href}>
								{dict.nav[route.key]}
							</Link>
						</li>
					))}
				</DetailList>
				<div className="flex flex-col md:flex-row gap-size-64 md:gap-size-24 mt-size-96">
					<DetailListContacts className="w-full" />
					<DetailListSocials className="w-full" />
					<DetailListAddress className="w-full" />
					<DetailListHours className="w-full" />
				</div>
				<div className="flex w-full justify-between gap-size-24 pt-size-24 text-size-16 text-background/50">
					<div className="flex flex-col w-full md:flex-row justify-between gap-size-12">
						<p className="w-full">Rinalds Miļicins</p>
						<p className="w-full">Milr Studio</p>
					</div>
					<div className="flex flex-col w-full md:flex-row justify-between gap-size-12">
						<p className="w-full flex flex-col items-end gap-size-12">
							<Link className="hover:underline" href="/cookies-privacy">{dict.footer.cookiesPrivacy}</Link>
							<ConsentSettingsButton>{dict.footer.cookieSettings}</ConsentSettingsButton>
						</p>
						<p className="w-full text-right">
							<a className="hover:underline" target="_blank" rel="noreferrer" href="https://alensbelikovs.com">
								{dict.footer.credit}
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}
