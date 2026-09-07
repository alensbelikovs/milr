import BodyLink from "@/components/actions/BodyLink"

export default function FormError() {
	return (
		<div className="flex flex-col text-center gap-size-96 col-span-full justify-center">
			<h3 className="text-size-48">Oops!</h3>
			<div className="flex flex-col gap-size-48">
				<p className="text-size-24 font-serif">Something went wrong</p>
				<h4 className="text-size-36">Please contact <br /> me directly:</h4>
			</div>
			<div className="flex flex-col gap-size-12">
				<BodyLink href="mailto:">contact@milrstudio.com</BodyLink>
				<BodyLink href="tel:">+371 28 755 431</BodyLink>
			</div>
		</div>
	)
}
