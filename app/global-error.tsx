"use client"
import "./globals.css"

// Replaces the root layout when it fails, so it brings its own html, body and styles
export default function GlobalError({ retry }: { error: Error & { digest?: string }, retry: () => void }) {
	return (
		<html lang="en">
			<body className="min-h-screen">
				<main className="min-h-screen grid grid-cols-12 gap-[24px] p-[24px] pt-[35vh]">
					<h1 className="col-start-2 col-span-10 text-heading-2">Something went wrong</h1>
					<p className="col-start-2 col-span-6 text-body-2">Placeholder page.</p>
					<button
						onClick={() => retry()}
						className="
							col-start-2 col-span-6 justify-self-start
							text-body-1 underline underline-offset-4 opacity-60 hover:opacity-100
						">
						Try again
					</button>
				</main>
			</body>
		</html>
	)
}
