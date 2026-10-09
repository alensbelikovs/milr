import { PortableText, toPlainText, type PortableTextComponents } from "@portabletext/react"
import HeroList from "@/components/sections/HeroList"
import PageReadySignal from "@/components/transition/PageReadySignal"
import Body18Container from "@/components/typography/Body18Container"
import Body18 from "@/components/typography/Body18"
import BodyLinkSecondary from "@/components/buttons/BodyLinkSecondary"
import Section from "@/components/layout/Section"
import { getDictionary, getLocale } from "@/lib/dictionaries"
import { alternates } from "@/lib/i18n"
import MainNav from "@/components/navigation/MainNav"
import formatDate from "@/utils/formatDate"
import { getCookiesPrivacy } from "@/utils/sanityGetters"

// Body18 supplies the paragraph element, so a block renders only its text and links
const components: PortableTextComponents = {
	block: { normal: ({ children }) => <>{children}</> },
	marks: {
		link: ({ children, value }) => <BodyLinkSecondary href={value?.href ?? ""}>{children}</BodyLinkSecondary>
	},
}

export async function generateMetadata() {
	const dict = await getDictionary()
	return { title: dict.footer.cookiesPrivacy, alternates: alternates("/cookies-privacy") }
}

export default async function CookiesPrivacyPage() {
	const [dict, lang, page] = await Promise.all([getDictionary(), getLocale(), getCookiesPrivacy()])
	const blocks = page?.body ?? []

	return (
		<main id="main">
			<MainNav color="foreground"/>
			<HeroList heading={dict.footer.cookiesPrivacy} />
			<Section noTopPadding>
				<Body18Container>
					{
						page &&
						<Body18 className="italic">
							{dict.cookiesPrivacy.effective} {formatDate(page.effectiveDate, lang)}
							{page.updatedDate && <><br/>{dict.cookiesPrivacy.updated} {formatDate(page.updatedDate, lang)}</>}
						</Body18>
					}
					{
						// A heading joins the paragraph after it, which is then skipped on its own
						blocks.flatMap((block, i) => {
							const next = blocks[i + 1]
							if (block.style === "h5") return (
								<Body18 key={block._key ?? i} as="div" heading={toPlainText(block)}>
									{next && next.style !== "h5" && <PortableText value={next} components={components} />}
								</Body18>
							)
							if (blocks[i - 1]?.style === "h5") return []
							return (
								<Body18 key={block._key ?? i}>
									<PortableText value={block} components={components} />
								</Body18>
							)
						})
					}
				</Body18Container>
			</Section>
			<PageReadySignal />
		</main>
	)
}
