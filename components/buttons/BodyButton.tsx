import ArrowRight from "@/components/icons/ArrowRight"
import Loader from "@/components/icons/Loader"
import LoadingLabel from "@/components/buttons/LoadingLabel"

export default function BodyButton(
	{
		children, className = "", type = "button", disabled, onClick, icon, color,
		"aria-busy": ariaBusy, "aria-expanded": ariaExpanded, "aria-controls": ariaControls,
	}:
		{
			children: React.ReactNode;
			icon?: React.ReactNode;
			color?: string;
			className?: string;
			type?: "button" | "submit" | "reset";
			disabled?: boolean;
			onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
			"aria-busy"?: boolean;
			"aria-expanded"?: boolean;
			"aria-controls"?: string;
		}) {
	// The loading stack — the ticker and the loader — is for a button that brings its own arrow. One
	// given an icon keeps its icon and its words whatever the state; aria-busy still says it is busy.
	const loading = ariaBusy && !icon

	return (
		<div className={`col-start-7 col-span-3 ${className}`} >
			{/* Explicit type: a button inside a <form> submits by default, which is right for the
			    contact form but wrong everywhere else this component gets reused. */}
			{/* light and the padding are BodyLink's, so the two still read as one family wherever
			    they sit side by side — light for a button laid over a picture or a dark band. */}
			<button
				className={`
				group text-size-16 w-full
				flex items-center justify-between
				cursor-pointer capitalize
				${
					color ? color
					: "bg-foreground/10 backdrop-blur-2xl hover:bg-foreground text-foreground hover:text-background"
				}
				rounded-sm p-size-16 lg:p-size-12
				disabled:bg-foreground/10 disabled:text-foreground/40 disabled:cursor-not-allowed`}
				type={type}
				disabled={disabled}
				onClick={onClick}
				aria-busy={ariaBusy}
				aria-expanded={ariaExpanded}
				aria-controls={ariaControls}>
				{
					/* Busy, and the words are no longer the caller's: the label takes over the whole of
					   the button's remaining width and cycles through what it has to say. children is
					   still rendered, for the screen reader alone — the ticker is hidden from it, and a
					   button with no name at all is worse than one whose name does not change. aria-busy
					   is what says the state; the name is only meant to say what pressing it does. */
					loading
						? <>
							<LoadingLabel />
							<span className="sr-only">{ children }</span>
						</>
						: <span>{ children }</span>
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
