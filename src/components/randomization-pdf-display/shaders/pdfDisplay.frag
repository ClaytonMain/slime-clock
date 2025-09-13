uniform float uCurrentSettingValue;
uniform float[1000] uPdfValues;
uniform float uNBins;

varying vec2 vUv;

#define PI2 6.283185
#define STEP 0.0005

// https://stackoverflow.com/questions/9246100/how-can-i-implement-the-distance-from-a-point-to-a-line-segment-in-glsl
float distanceToLine(vec2 pt1, vec2 pt2, vec2 testPt) {
    vec2 lineDir = pt2 - pt1;
    vec2 normalDir = vec2(lineDir.y, -lineDir.x);
    vec2 dirToPt1 = testPt - pt1;
    return abs(dot(normalize(normalDir), dirToPt1));
}

void main() {
    // Get slope of PDF using neighbors.
    float leftvUv = vUv.x - STEP;
    float rightvUv = vUv.x + STEP;
    int leftIndex = clamp(int(floor(leftvUv * uNBins)), 0, int(uNBins) - 1);
    int rightIndex = clamp(int(floor(rightvUv * uNBins)), 0, int(uNBins) - 1);
    int centerIndex = int(floor(vUv.x * uNBins));
    float dist = distanceToLine(vec2(leftvUv, uPdfValues[leftIndex]), vec2(rightvUv, uPdfValues[rightIndex]), vUv);
    dist += smoothstep(0.1, 0.2, abs(uPdfValues[leftIndex] - uPdfValues[rightIndex]));
    vec4 color = vec4(0.094, 0.094, 0.106, 0.7 + (sign(uPdfValues[centerIndex] - vUv.y) * 0.5 + 0.5) * 0.2);

    float smoothDist = smoothstep(0.01, 0.0, dist);
    color = mix(color, vec4(0.0, 0.65, 0.96, 1.0), smoothDist * smoothDist * smoothDist);

    gl_FragColor = color;

    // #include <tonemapping_fragment>
    // #include <colorspace_fragment>
}