import Image from "next/image"

export default function TestimonialAuthorBox(
	{ src }:
	{ src: string }
) {
	return (
		<div className="col-span-4 col-start-2 mt-[64px] relative aspect-10/16">
			<Image src={src} alt="Placeholder" className="object-cover" fill />
		</div>
	)
}