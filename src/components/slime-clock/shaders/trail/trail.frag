uniform sampler2D uAgentPositionsTexture;
uniform sampler2D uClockTexture;
uniform sampler2D uTrailTexture;
uniform vec2 uDisplayTextureResolution;
uniform float uDepositRate;
uniform float uTrailDecayRate;
uniform float uTrailDiffuseRate;
uniform float uTrailTextDecayRate;
uniform float uTrailTextDiffuseRate;
uniform float uTrailNegativeSpaceDecayRate;
uniform float uTrailNegativeSpaceDiffuseRate;
uniform int uBoundaryBehavior;
uniform float uDelta;
uniform float uTime;

varying vec2 vUv;

#define PI2 6.283185307179586

// Offsets for the 8 neighboring pixels in a 2D grid.
float neighborOffsets[8] = float[](1.0, 1.0, 0.0, -1.0, -1.0, -1.0, 0.0, 1.0);

void main() {
    vec2 uv = vUv;

    // trailData.r := Current trail intensity.
    // trailData.g := Last present agent's direction.
    // trailData.b := 1.0 (unused).
    // trailData.a := 1.0 (unused).
    vec4 trailData = texture2D(uTrailTexture, uv);

    // It's just white wherever there's text.
    vec4 clockData = texture2D(uClockTexture, uv);

    // agentPositionData.r := 1.0 or 0.0 -> Agent presence boolean.
    // agentPositionData.g := 1.0 or 0.0 -> Agent took step boolean.
    // agentPositionData.b := Agent direction.
    // agentPositionData.a := 1.0 (unused).
    vec4 agentPositionData = texture2D(uAgentPositionsTexture, uv);

    float intensity = trailData.x;
    // Deposit trail if there is an agent present.
    intensity += agentPositionData.x * agentPositionData.y * uDepositRate * uDelta;

    // Diffuse the trail intensity based on the neighboring trail intensities.
    int i;
    float averageNeighborIntensity = intensity;
    for (i = 0; i < 8; i++) {
        vec2 neighborUv = uv + vec2(neighborOffsets[i], neighborOffsets[(i + 6) % 8]) / uDisplayTextureResolution;
        if (neighborUv.x <= 0.0 || neighborUv.x >= 1.0 || neighborUv.y <= 0.0 || neighborUv.y >= 1.0) {
            if (uBoundaryBehavior == 0) { // Wrap
                neighborUv = fract(neighborUv);
            } else if (uBoundaryBehavior == 1) { // Bounce
                averageNeighborIntensity -= 100.0;
                continue;
            }
        }
        float neighborTrail = texture2D(uTrailTexture, neighborUv).x;
        vec2 neighborData = texture2D(uAgentPositionsTexture, neighborUv).xy;
        averageNeighborIntensity += min(neighborTrail + neighborData.x * neighborData.y * uDepositRate * uDelta, 1.0);
        // averageNeighborIntensity += neighborTrail;
        // averageNeighborIntensity += texture2D(uTrailTexture, neighborUv).x;
    }
    averageNeighborIntensity /= 9.0;

    if (averageNeighborIntensity < 0.0) {
        intensity = 0.0;
    } else {
        // Borrowing some diffuse logic from Sebastian Lague's implementation.
        // https://github.com/SebLague/Slime-Simulation/blob/main/Assets/Scripts/Slime/SlimeSim.compute
        float diffuseWeight = min(uTrailDiffuseRate * uDelta, 1.0);
        averageNeighborIntensity = intensity * (1.0 - diffuseWeight) + averageNeighborIntensity * diffuseWeight;
        intensity = max(averageNeighborIntensity - uTrailDecayRate * uDelta, 0.0);
    }

    // // Decay negative space
    // vec2 centerRelativePosition = (uv - 0.5) * uDisplayTextureResolution;
    // float edgeDistance = sdRoundBox(centerRelativePosition, uDisplayTextureResolution * 0.5 - uBorderDistance, vec4(uBorderRoundness));
    // edgeDistance = edgeDistance > 0.0 ? clamp(edgeDistance * (1.0 - uBorderSmoothing) / uBorderDistance, 0.0, 1.0) : 0.0;

    // // edgeDistance = 1.0 - edgeDistance * uBorderStrength;
    // float edgeDecayRate = edgeDistance * uBorderStrength;

    float negativeSpaceDecayRate = uTrailNegativeSpaceDecayRate * step(clockData.r, 0.5);

    // intensity *= edgeDistance;
    intensity = max(intensity - negativeSpaceDecayRate * uDelta, 0.0);

    float lastAgentDirection = agentPositionData.z > 0.0 ? agentPositionData.z : trailData.y;

    gl_FragColor = vec4(intensity, lastAgentDirection, 0.0, 1.0);
    // gl_FragColor = vec4(intensity, edgeDistance, edgeDistance, 1.0);
    // gl_FragColor = vec4(intensity, edgeDecayRate, edgeDecayRate, 1.0);
}