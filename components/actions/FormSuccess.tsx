import BodyLink from "@/components/actions/BodyLink"

export default function FormSuccess(
	{ home }: { home?: boolean }) {
	return (
		<div className="flex flex-col text-center gap-size-96 col-span-full justify-center">
			<h3 className="text-size-48">Thank You!</h3>
			<div className="flex flex-col gap-size-48">
				<p className="text-size-24 font-serif">Chat Soon:</p>
				<div className="flex flex-col gap-size-12">
					<h4 className="text-size-36">September 15</h4>
					<h5 className="text-size-24">between 8:00 – 19:00</h5>
				</div>
			</div>
			<div className="flex flex-col gap-size-12">
				<BodyLink href={home ? "/" : "#"}>See Confirmation E-mail</BodyLink>
			</div>
		</div>
	)
}
