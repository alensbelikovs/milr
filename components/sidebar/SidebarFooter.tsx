// Pinned to the bottom of the sidebar over a fade. The body's root needs grid-rows-[1fr_auto] min-h-full.
export default function SidebarFooter({ children }: { children: React.ReactNode }) {
	return (
		<div className="
			col-span-full sticky bottom-0
			grid grid-cols-6 gap-x-size-24 py-size-48
			bg-linear-to-t from-background via-background to-transparent
		">
			<div className="col-start-2 col-span-4">
				{children}
			</div>
		</div>
	)
}
