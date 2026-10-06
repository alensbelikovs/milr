import LoadingLabel from "@/components/buttons/LoadingLabel"
import ArrowRight from "@/components/icons/ArrowRight"
import Loader from "@/components/icons/Loader"

// A button with an arrow (or a custom icon). Busy without an icon, it cycles a loading label instead.
export default function BodyButton(
	{ children, className = "", color, icon, type = "button", ...props }: {
		children: React.ReactNode,
		className?: string,
		color?: string,
		icon?: React.ReactNode
	} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const loading = props["aria-busy"] && !icon

	return (
		<div className={`col-start-7 col-span-3 ${className}`}>
			<button
				type={type}
				className={`
					group text-size-16 w-full
					flex items-center justify-between
					cursor-pointer capitalize
					rounded-sm p-size-16 lg:p-size-12
					disabled:bg-foreground/10 disabled:text-foreground/40 disabled:cursor-not-allowed
					${color ?? `
						bg-foreground/10 backdrop-blur-2xl text-foreground
						hover:bg-foreground hover:text-background
					`}
				`}
				{...props}>
				{
					loading
						? <>
							<LoadingLabel />
							<span className="sr-only">{children}</span>
						</>
						: <span>{children}</span>
				}
				<span className="relative flex overflow-hidden">
					{
						loading
							? <Loader dimensions={12} fill="currentColor" />
							: icon ?? <ArrowRight dimensions={12} fill="currentColor" />
					}
				</span>
			</button>
		</div>
	)
}
