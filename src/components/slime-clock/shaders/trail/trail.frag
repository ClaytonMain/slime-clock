uniform sampler2D uAgentPositionsTexture;
uniform sampler2D uClockTexture;
uniform sampler2D uTrailTexture;

uniform vec2 uDisplayTextureResolution;

uniform float uClockDepositRate;
uniform float uBackgroundDepositRate;

uniform float uClockDecayRate;
uniform float uClockDiffuseRate;
uniform float uBackgroundDecayRate;
uniform float uBackgroundDiffuseRate;

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

    // It's just white wherever the clock is.
    vec4 clockData = texture2D(uClockTexture, uv);

    // agentPositionData.r := 1.0 or 0.0 -> Agent presence boolean.
    // agentPositionData.g := Agent deposit amount.
    // agentPositionData.b := Agent direction.
    // agentPositionData.a := 1.0 (unused).
    vec4 agentPositionData = texture2D(uAgentPositionsTexture, uv);

    float intensity = trailData.x;
    // Deposit trail if agent took a step. Deposit rate is different for clock and background.
    float depositRate = (uClockDepositRate * clockData.r) + (uBackgroundDepositRate * (1.0 - clockData.r));
    intensity += agentPositionData.y * depositRate * uDelta;

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
        vec4 neighborTrailData = texture2D(uTrailTexture, neighborUv);
        vec4 neighborPositionData = texture2D(uAgentPositionsTexture, neighborUv);
        vec4 neighborClockData = texture2D(uClockTexture, neighborUv);
        float neighborIntensity = neighborTrailData.x;
        float neighborDepositRate = (uClockDepositRate * neighborClockData.r) + (uBackgroundDepositRate * (1.0 - neighborClockData.r));
        averageNeighborIntensity += min(neighborIntensity + neighborPositionData.y * neighborDepositRate * uDelta, 1.0);
    }
    averageNeighborIntensity /= 9.0;

    float decayRate = (uClockDecayRate * clockData.r) + (uBackgroundDecayRate * (1.0 - clockData.r));
    float diffuseRate = (uClockDiffuseRate * clockData.r) + (uBackgroundDiffuseRate * (1.0 - clockData.r));
    // Borrowing some diffuse logic from Sebastian Lague's implementation.
    // https://github.com/SebLague/Slime-Simulation/blob/main/Assets/Scripts/Slime/SlimeSim.compute
    float diffuseWeight = min(diffuseRate * uDelta, 1.0);
    averageNeighborIntensity = intensity * (1.0 - diffuseWeight) + averageNeighborIntensity * diffuseWeight;
    intensity = max(averageNeighborIntensity - decayRate * uDelta, 0.0);

    float lastAgentDirection = agentPositionData.z > 0.0 ? agentPositionData.z : trailData.y;

    gl_FragColor = vec4(intensity, lastAgentDirection, 0.0, 1.0);
}