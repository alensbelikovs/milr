import Link from "@/components/navigation/LocaleLink"
import FadeReveal from "@/components/animation/FadeReveal"
import TextMaskReveal from "@/components/animation/TextMaskReveal"
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
			bg-accent text-background
		">
			<div className="col-start-2 col-span-10 flex flex-col gap-size-96">
				{/* The links rise in together once the list scrolls into view, staggered like the menu's */}
				<DetailList label={dict.common.navigation}>
					{STATIC_ROUTES.map((route, index) => (
						<li className="my-1.5" key={route.href}>
							{/* Padding keeps descenders inside the mask; the negative margin keeps the spacing */}
							<TextMaskReveal triggerOn="ul" delay={index * 0.05} className="pb-1 -mb-1">
								<Link className="text-size-24 hover:underline" href={route.href}>
									{dict.nav[route.key]}
								</Link>
							</TextMaskReveal>
						</li>
					))}
				</DetailList>
				{/* Each list fades in on scroll from md up, a step after the one before it */}
				<div className="flex flex-col md:flex-row gap-size-64 md:gap-size-24 mt-size-96">
					{[DetailListContacts, DetailListSocials, DetailListAddress, DetailListHours].map((List, index) => (
						<div className="w-full" key={index}>
							<FadeReveal wideOnly delay={index * 0.05} />
							<List />
						</div>
					))}
				</div>
				<div className="flex w-full justify-between gap-size-24 pt-size-24 text-size-18 font-serif text-background/50">
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
								<span className="sr-only"> ({dict.common.newTab})</span>
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}
