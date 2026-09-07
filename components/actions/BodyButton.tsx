export default function BodyButton(
	{ children, className, type = "button", disabled, onClick, "aria-busy": ariaBusy }:
		{
			children: React.ReactNode;
			className?: string;
			type?: "button" | "submit" | "reset";
			disabled?: boolean;
			onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
			"aria-busy"?: boolean;
		}) {
	return (
		<div className={`col-start-7 col-span-3 ${className ?? ""}`} >
			{/* Explicit type: a button inside a <form> submits by default, which is right for the
			    contact form but wrong everywhere else this component gets reused. */}
			<button
				className="
				text-size-16 underline hover:no-underline
				underline-offset-4 cursor-pointer capitalize
				disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
				type={type}
				disabled={disabled}
				onClick={onClick}
				aria-busy={ariaBusy}>
				{children}
			</button>
		</div>
	)
}
