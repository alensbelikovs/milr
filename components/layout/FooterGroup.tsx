

export default function FooterGroup(
	{ children, title }: 
	{ children: React.ReactNode, title: string }
) {
	return (
		<div className="flex gap-[24px]">
			<h5 className="text-body-1 text-background/50">{ title }</h5>
			<div className="flex flex-col">
				{children}
			</div>
		</div>
	)
}