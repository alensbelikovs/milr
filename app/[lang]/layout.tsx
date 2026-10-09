import type { Metadata } from "next"
import localFont from "next/font/local"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"
import { ReactLenis } from "lenis/react"
import "lenis/dist/lenis.css"
import "../globals.css"
import ConsentBanner from "@/components/consent/ConsentBanner"
import SiteProvider from "@/components/layout/SiteProvider"
import Navbar from "@/components/navigation/Navbar"
import PointerOverlay from "@/components/pointer/PointerOverlay"
import Footer from "@/components/sections/Footer"
import Sidebar from "@/components/sidebar/Sidebar"
import TransitionControl from "@/components/transition/TransitionControl"
import { getDictionary, getLocale } from "@/lib/dictionaries"
import { LOCALES } from "@/lib/i18n"
import { getGeneralInformation } from "@/utils/sanityGetters"

const sans = localFont({
	src: "../../fonts/font-sans.woff2",
	variable: "--font-sans-local",
	weight: "300 900",
	style: "normal",
	display: "swap",
})

const serif = localFont({
	src: "../../fonts/font-serif.woff2",
	variable: "--font-serif-local",
	weight: "200 700",
	style: "normal",
	display: "swap",
})

// Consent Mode v2: denied until the banner is accepted; the choice is stored by store/ConsentStore
const CONSENT_DEFAULT = `
	window.dataLayer = window.dataLayer || []
	function gtag() { dataLayer.push(arguments) }
	gtag("consent", "default", {
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		analytics_storage: localStorage.getItem("consent") === "granted" ? "granted" : "denied",
	})
`

export function generateStaticParams() {
	return LOCALES.map(lang => ({ lang }))
}

export async function generateMetadata(): Promise<Metadata> {
	const { meta } = await getDictionary()
	return { title: { default: meta.title, template: `%s — ${meta.title}` }, description: meta.description }
}

// General information is fetched here once, for the client components that show it (footer, menu, contact)
export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
	const [lang, dict, general] = await Promise.all([getLocale(), getDictionary(), getGeneralInformation()])

	return (
		<html lang={lang} className={`${sans.variable} ${serif.variable} h-full antialiased`}>
			<body className="min-h-screen">
				<a
					href="#main"
					className="
						sr-only focus:not-sr-only
						focus:fixed focus:top-size-16 focus:left-size-16 focus:z-20
						focus:p-size-12 focus:bg-background focus:text-size-16
					">
					{dict.common.skipToContent}
				</a>
				{/* afterInteractive, as a client-rendered 404 never runs beforeInteractive's inline tag.
					Its effect still fires before GoogleAnalytics', which comes later in the tree. */}
				<Script id="consent-default">{CONSENT_DEFAULT}</Script>
				<SiteProvider lang={lang} dict={dict} information={general}>
					<ReactLenis root />
					<TransitionControl>{children}</TransitionControl>
					<Navbar />
					<Sidebar />
					<PointerOverlay />
					<Footer />
					<ConsentBanner />
				</SiteProvider>
			</body>
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
		</html>
	)
}
