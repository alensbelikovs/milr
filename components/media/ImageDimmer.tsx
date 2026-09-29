// A wash over a picture, so text laid on top of it stays readable whatever the picture happens to
// be. Its own component because the shade is a decision about the site rather than about any one
// image — every place that darkens one should darken it by the same amount.
//
// A sibling of the image rather than a class on it: the image is often being animated, and a
// background on the animating element would be carried along with it.
export default function ImageDimmer() {
	return <div className="absolute inset-0 bg-foreground/20" />
}
