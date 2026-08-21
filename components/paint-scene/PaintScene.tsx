import PaintSceneCanvas from "@/components/paint-scene/PaintSceneCanvas"

// The two srcs are the same image under different post-processing: srcBefore is what the plane shows
// at rest, srcAfter is what a click dissolves through to. Passed down rather than fetched here, so the
// caller decides which pair its scene draws.
export default function PaintScene({ id, srcBefore, srcAfter }: { id: string, srcBefore: string, srcAfter: string }) {
	return (
		<div className="relative overflow-hidden w-full h-[120vh]">
			<div className="absolute inset-0">
				<PaintSceneCanvas id={id} srcBefore={srcBefore} srcAfter={srcAfter}/>
			</div>
		</div>
	)
}
