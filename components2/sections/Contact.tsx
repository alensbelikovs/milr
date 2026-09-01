import SectionHeadingRight from "@/components2/typography/SectionHeadingRight"
import TextLineReveal from "@/components2/typography/TextLineReveal"
import MaskRevealGroup from "@/components2/animation/MaskRevealGroup"
import MaskRevealGroupItem from "@/components2/animation/MaskRevealGroupItem"
import ContactForm from "@/components2/actions/ContactForm"

const EMAIL = "contact@milrstudio.com"
const PHONE = "+371 28 755 431"
const INSTAGRAM = "https://www.instagram.com/milrstudio/"

const DETAIL_CLASS_NAME = "text-size-14"
const LABEL_CLASS_NAME = "text-size-14 text-foreground/50"

export default function Contact() {
	return (
		<section>
			<SectionHeadingRight>
				{"Let's work together"}
			</SectionHeadingRight>
			<div className="w-full grid grid-cols-12 gap-size-24 px-size-24 pb-size-128">
				<div className="col-start-2 col-span-2 flex flex-col gap-size-48">
					<TextLineReveal as="p" className="text-size-24">
						{
							"Send a quick note to start the conversation, " +
							"or contact me directly using one of the methods below."
						}
					</TextLineReveal>
					<ContactDetails />
				</div>
				<div className="col-start-7 col-span-5">
					<ContactForm />
				</div>
			</div>
		</section>
	)
}

// One group, so the three blocks below enter as a single run rather than as three that each noticed
// the viewport for themselves. Every line in here is an item of it, links included — which is why
// the addresses are plain anchors rather than BodyLink, since that carries a ScrollTrigger of its
// own and would drop out of the stagger.
const ContactDetails = () => {
	return (
		<MaskRevealGroup className="flex flex-col gap-size-48">
			{/* grid rather than two columns side by side, so the labels line up down the block and a
			    value wrapping to a second line cannot push its own label out of step. */}
			<div className="grid grid-cols-3 gap-x-size-16 gap-y-size-12">
				<MaskRevealGroupItem className={LABEL_CLASS_NAME}>E-mail</MaskRevealGroupItem>
				<MaskRevealGroupItem className={`col-span-2 ${DETAIL_CLASS_NAME}`}>
					<a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
						{EMAIL}
					</a>
				</MaskRevealGroupItem>

				<MaskRevealGroupItem className={LABEL_CLASS_NAME}>Phone</MaskRevealGroupItem>
				<MaskRevealGroupItem className={`col-span-2 ${DETAIL_CLASS_NAME}`}>
					<a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
				</MaskRevealGroupItem>

				<MaskRevealGroupItem className={LABEL_CLASS_NAME}>Direct</MaskRevealGroupItem>
				<MaskRevealGroupItem className={`col-span-2 ${DETAIL_CLASS_NAME}`}>
					<a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a>
				</MaskRevealGroupItem>
			</div>

			<div className="grid grid-cols-3 gap-x-size-16">
				<MaskRevealGroupItem className={LABEL_CLASS_NAME}>Address</MaskRevealGroupItem>
				<div className={`col-span-2 flex flex-col ${DETAIL_CLASS_NAME}`}>
					<MaskRevealGroupItem>Aleksandra Čaka 56</MaskRevealGroupItem>
					<MaskRevealGroupItem>LV-1011, Rīga</MaskRevealGroupItem>
					<MaskRevealGroupItem>Latvia</MaskRevealGroupItem>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-x-size-16">
				<MaskRevealGroupItem className={LABEL_CLASS_NAME}>Hours</MaskRevealGroupItem>
				<div className={`col-span-2 flex flex-col ${DETAIL_CLASS_NAME}`}>
					<MaskRevealGroupItem>Mon – Fri</MaskRevealGroupItem>
					<MaskRevealGroupItem>8:00 – 19:00</MaskRevealGroupItem>
				</div>
			</div>
		</MaskRevealGroup>
	)
}
