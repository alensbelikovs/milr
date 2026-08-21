
export default function PaginationPageButton({ number, active }: { number: string, active?: boolean }) {
	return (
		<button
			className={`
			text-body-1 cursor-pointer p-[12px]
			hover:underline hover:underline-offset-4
			${active ? 'text-foreground' : 'text-foreground/50'}
			`}
		>
			{ number }
		</button>
	)
}
