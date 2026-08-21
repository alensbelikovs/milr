uniform sampler2D uBeforeTexture;
uniform sampler2D uAfterTexture;
uniform float uPlaneAspect;
uniform float uImageAspect;
uniform float uProgress;
uniform float uRadiusMin;
uniform float uRadiusMax;
uniform float uLumaDisplace;
uniform float uFalloff;
uniform vec2 uOrigin;

varying vec2 vUv;

const vec3 LUMA_WEIGHTS = vec3(0.2126, 0.7152, 0.0722);

const float MIN_HALF_BAND = 1e-5;

void main() {
	vec2 range = uPlaneAspect > uImageAspect
		? vec2(1.0, uImageAspect / uPlaneAspect)
		: vec2(uPlaneAspect / uImageAspect, 1.0);

	// One uv for both layers: they are the same source image with different post-processing, so a
	// single aspect keeps them in register no matter how the viewport crops them.
	vec2 uv = (vUv - 0.5) * range + 0.5;

	vec4 beforeEncoded = texture2D(uBeforeTexture, uv);
	vec4 afterEncoded = texture2D(uAfterTexture, uv);

	// Read off the encoded values, before the EOTF — the same perceptual-ish weighting the hero uses.
	// The revealed layer drives the displacement, so the boundary traces detail in the incoming image.
	float luma = dot(afterEncoded.rgb, LUMA_WEIGHTS);

	// uOrigin is the cursor, in plane uv. Scaling x by the plane aspect measures distance in units of
	// plane height in both directions, which is what keeps the circle round rather than an oval.
	float dist = length((vUv - uOrigin) * vec2(uPlaneAspect, 1.0));

	// Luma pushes the boundary inward on dark pixels and leaves it at the full radius on bright ones,
	// so the circle reads as an irregular blob. The visible edge lands in [radius - uLumaDisplace, radius].
	float front = dist + (1.0 - luma) * uLumaDisplace;

	float halfBand = max(uFalloff * 0.5, MIN_HALF_BAND);

	// One timeline scalar drives the whole effect: uProgress 0 rests at uRadiusMin, 1 sits at uRadiusMax.
	float radius = mix(uRadiusMin, uRadiusMax, uProgress);

	// 1 outside the circle = before still covering, 0 inside = after revealed.
	float mask = smoothstep(radius - halfBand, radius + halfBand, front);

	vec4 before = sRGBTransferEOTF(beforeEncoded);
	vec4 after = sRGBTransferEOTF(afterEncoded);

	gl_FragColor = vec4(mix(after.rgb, before.rgb, mask), mix(after.a, before.a, mask));
	#include <colorspace_fragment>
}
