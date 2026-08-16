uniform sampler2D uTexture;
uniform float uPlaneAspect;
uniform float uImageAspect;

varying vec2 vUv;

void main() {
	vec2 range = uPlaneAspect > uImageAspect
		? vec2(1.0, uImageAspect / uPlaneAspect)
		: vec2(uPlaneAspect / uImageAspect, 1.0);

	vec2 uv = (vUv - 0.5) * range + 0.5;

	gl_FragColor = sRGBTransferEOTF(texture2D(uTexture, uv));
	#include <colorspace_fragment>
}
