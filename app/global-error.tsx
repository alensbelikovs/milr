"use client"
// import PageReadySignal from "@/components/transition/PageReadySignal"
import "./globals.css"

// The last-resort boundary: it catches what no nested error boundary did, including a failure in the
// root layout, and REPLACES that layout while it renders. Hence its own html/body and its own import
// of globals.css — nothing from the layout reaches this file, fonts included.
export default function GlobalError({ retry }: { error: Error & { digest?: string }, retry: () => void }) {
	return (
		<html lang="en">
			<body className="min-h-screen">
				<main className="min-h-screen grid grid-cols-12 gap-[24px] p-[24px] pt-[35vh]">
					<h1 className="col-start-2 col-span-10 text-heading-2">Something went wrong</h1>
					<p className="col-start-2 col-span-6 text-body-2">
						Placeholder page.
					</p>
					<button
						onClick={() => retry()}
						className="col-start-2 col-span-6 justify-self-start text-body-1 underline underline-offset-4 opacity-60 hover:opacity-100">
						Try again
					</button>

					{/* Inert while this file is what renders: replacing the root layout takes TransitionControl
					    with it, so nothing is subscribed to hear the signal. Kept so that any future error UI
					    lifted into the layout — an app/error.tsx — resolves the curtain rather than stranding
					    it on the failsafe. */}
					{/*<PageReadySignal />*/}
				</main>
			</body>
		</html>
	)
}
