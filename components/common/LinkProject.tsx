import Image from "next/image"
import Link from "next/link"

type LinkProjectProps = {
	title: string
	img: string
	slug: string
	className?: string
}

export default function LinkProject({ title, img, slug, className = "" }: LinkProjectProps) {
	return (
		<Link href={slug} className={`group ${className}`.trim()}>
			<div className="relative overflow-hidden h-full">
				<Image
					src={img}
					alt={title}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover scale-120 transition-transform duration-700 ease-out group-hover:scale-100 group-focus-visible:scale-100" />
			</div>
			<h3 className="text-body-1 mt-[12px]">{title}</h3>
		</Link>
	)
}
