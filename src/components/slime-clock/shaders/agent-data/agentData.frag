uniform sampler2D uAgentDataTexture;
uniform sampler2D uClockTexture;
uniform sampler2D uTrailTexture;
uniform vec2 uDisplayTextureResolution;
uniform float uClockAttraction;
uniform float uSensorAngle;
uniform float uRotationRate;
uniform float uSensorOffset;
uniform float uSensorWidth;
uniform float uStepSize;
uniform float uCrowdAvoidance;
uniform float uWanderStrength;
uniform int uBoundaryBehavior; // 0 = wrap, 1 = bounce
uniform float uDelta;
uniform float uTime;

varying vec2 vUv;

#define PI2 6.283185
#include ../../../../shaders/random.glsl

// Credit to Iñigo Quilez for the sdRoundBox function.
// https://iquilezles.org/articles/distfunctions2d/
// b.x = half width
// b.y = half height
// r.x = roundness top-right  
// r.y = roundness boottom-right
// r.z = roundness top-left
// r.w = roundness bottom-left
float sdRoundBox(in vec2 p, in vec2 b, in vec4 r) {
    r.xy = (p.x > 0.0) ? r.xy : r.zw;
    r.x = (p.y > 0.0) ? r.x : r.y;
    vec2 q = abs(p) - b + r.x;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
}

// // Offsets for the 8 neighboring pixels in a 2D grid.
// float neighborOffsets[8] = float[](1.0, 1.0, 0.0, -1.0, -1.0, -1.0, 0.0, 1.0);
// float getTrailIntensity(vec2 position) {
//     float intensity = texture2D(uTrailTexture, position / uDisplayTextureResolution).r;
//     bool hasSensorOffscreen = false;
//     for (int i = 0; i < 8; i++) {
//         if (hasSensorOffscreen) {
//             break;
//         }
//         vec2 neighborUv = (position + vec2(neighborOffsets[i], neighborOffsets[(i + 6) % 8]) * uSensorWidth) / uDisplayTextureResolution;
//         if (neighborUv.x < 0.0 || neighborUv.x > 1.0 || neighborUv.y < 0.0 || neighborUv.y > 1.0) {
//             if (uBoundaryBehavior == 0) { // Wrap
//                 neighborUv = fract(neighborUv);
//             } else if (uBoundaryBehavior == 1) { // Bounce
//                 hasSensorOffscreen = true;
//                 continue;
//             }
//         }
//         // trailData.r := Current trail intensity.
//         // trailData.g := 1.0 (unused).
//         // trailData.b := 1.0 (unused).
//         // trailData.a := 1.0 (unused).
//         // vec4 trailData = texture2D(uTrailTexture, neighborUv);
//         intensity += texture2D(uTrailTexture, neighborUv).r;
//     }
//     return hasSensorOffscreen ? -1000.0 : intensity / 9.0;
// }

// float getTrailIntensity(vec2 position) {
//     vec2 textureUv = position / uDisplayTextureResolution;
//     float intensity = max(texture2D(uTrailTexture, textureUv).r, texture2D(uClockTexture, textureUv).r * uClockAttraction);
//     bool hasSensorOffscreen = false;
//     for (int i = 0; i < 4; i++) {
//         if (hasSensorOffscreen) {
//             break;
//         }
//         vec2 neighborUv = (position + vec2((i % 2) * 2 - 1, (i / 2) * 2 - 1) * uSensorWidth) / uDisplayTextureResolution;
//         if (neighborUv.x < 0.0 || neighborUv.x > 1.0 || neighborUv.y < 0.0 || neighborUv.y > 1.0) {
//             if (uBoundaryBehavior == 0) { // Wrap
//                 neighborUv = fract(neighborUv);
//             } else if (uBoundaryBehavior == 1) { // Bounce
//                 hasSensorOffscreen = true;
//                 continue;
//             }
//         }
//         // trailData.r := Current trail intensity.
//         // trailData.g := Last present agent's direction.
//         // trailData.b := 1.0 (unused).
//         // trailData.a := 1.0 (unused).
//         // vec4 trailData = texture2D(uTrailTexture, neighborUv);
//         intensity += texture2D(uTrailTexture, neighborUv).r;
//     }
//     return hasSensorOffscreen ? -1000.0 : intensity / 5.0;
// }

// Offsets for the 8 neighboring pixels in a 2D grid.
float neighborOffsets[8] = float[](1.0, 1.0, 0.0, -1.0, -1.0, -1.0, 0.0, 1.0);
float getTrailIntensity(vec2 position) {
    float intensity = max(texture2D(uTrailTexture, position / uDisplayTextureResolution).r, texture2D(uClockTexture, position / uDisplayTextureResolution).r * uClockAttraction);
    bool hasSensorOffscreen = false;
    for (int i = 0; i < 8; i++) {
        if (hasSensorOffscreen) {
            break;
        }
        vec2 neighborUv = (position + vec2(neighborOffsets[i], neighborOffsets[(i + 6) % 8]) * uSensorWidth) / uDisplayTextureResolution;
        if (neighborUv.x < 0.0 || neighborUv.x > 1.0 || neighborUv.y < 0.0 || neighborUv.y > 1.0) {
            if (uBoundaryBehavior == 0) { // Wrap
                neighborUv = fract(neighborUv);
            } else if (uBoundaryBehavior == 1) { // Bounce
                hasSensorOffscreen = true;
                continue;
            }
        }
        // trailData.r := Current trail intensity.
        // trailData.g := 1.0 (unused).
        // trailData.b := 1.0 (unused).
        // trailData.a := 1.0 (unused).
        // vec4 trailData = texture2D(uTrailTexture, neighborUv);
        intensity += texture2D(uTrailTexture, neighborUv).r;
    }
    return hasSensorOffscreen ? -1000.0 : intensity / 9.0;
}

void main() {
    // vec2 uv = vUv;

    // Some values we'll need later.
    float positiveOrNegative = random(vUv + uTime) * 2.0 - 1.0;
    float rotationWeight = uRotationRate * uDelta;
    float oneMinusCrowdAvoidance = 1.0 - uCrowdAvoidance;

    // agentData.r := Agent x position.
    // agentData.g := Agent y position.
    // agentData.b := Agent direction angle.
    // agentData.a := Agent deposit amount.
    vec4 agentData = texture2D(uAgentDataTexture, vUv);

    // Motor stage.
    // The agent moves in its current direction by a fixed step size
    // if it's able. Moving increases its available deposit amount.
    // If it can't move, it randomizes its direction and decreases its
    // available deposit amount.
    vec2 agentPosition = agentData.xy * uDisplayTextureResolution;
    float agentDirectionAngle = agentData.z * PI2;
    vec2 agentDirection = vec2(cos(agentDirectionAngle), sin(agentDirectionAngle));
    vec2 agentTrailUv = agentData.xy;

    vec2 newAgentPosition = agentPosition + agentDirection * uStepSize * uDelta;
    vec2 newAgentTrailUv = newAgentPosition / uDisplayTextureResolution;

    float agentDepositAmount = agentData.w;

    if (newAgentPosition.x <= 0.0 || newAgentPosition.x >= (uDisplayTextureResolution.x - 1.0) || newAgentPosition.y <= 0.0 || newAgentPosition.y >= (uDisplayTextureResolution.y - 1.0)) {
        if (uBoundaryBehavior == 0) { // Wrap
            newAgentPosition = mod(newAgentPosition, uDisplayTextureResolution);
            newAgentTrailUv = fract(newAgentTrailUv);
        } else if (uBoundaryBehavior == 1) { // Bounce
            agentDirectionAngle = atan(-(agentTrailUv.y - 0.5), -(agentTrailUv.x - 0.5));
            agentDirection = vec2(cos(agentDirectionAngle), sin(agentDirectionAngle));
            newAgentPosition = agentPosition + agentDirection * uStepSize * uDelta;
            newAgentTrailUv = newAgentPosition / uDisplayTextureResolution;
        }
    }

    float newAgentPositionIntensity = getTrailIntensity(newAgentPosition);

    // If the new position isn't off the screen, handle movement.
    if (newAgentPositionIntensity >= 0.0) {
        agentPosition = newAgentPosition;
        agentTrailUv = newAgentTrailUv;
        agentDirectionAngle += uWanderStrength * positiveOrNegative * uDelta;
        // If the new position is too crowded, decrease deposit amount
        // and randomize direction.
        if (newAgentPositionIntensity > oneMinusCrowdAvoidance) {
            agentDirectionAngle += rotationWeight * positiveOrNegative;
            agentDepositAmount -= uDelta * 0.1;
        }
        // Otherwise, just increase deposit amount.
        else {
            agentDepositAmount += uDelta * 0.1;
        }
    }
    // Otherwise, set deposit amount to zero and move to a random position.
    else {
        agentDepositAmount = 0.0;
        agentPosition = vec2(random(vUv + uTime), random(vUv - uTime)) * uDisplayTextureResolution;
        agentTrailUv = agentPosition / uDisplayTextureResolution;
    }

    // Sensory stage.
    // Sample the trail at front, front-left, and front-right positions.
    vec2 front = agentPosition + vec2(cos(agentDirectionAngle), sin(agentDirectionAngle)) * uSensorOffset;
    float frontLeftAngle = agentDirectionAngle + uSensorAngle;
    vec2 frontLeft = agentPosition + vec2(cos(frontLeftAngle), sin(frontLeftAngle)) * uSensorOffset;
    float frontRightAngle = agentDirectionAngle - uSensorAngle;
    vec2 frontRight = agentPosition + vec2(cos(frontRightAngle), sin(frontRightAngle)) * uSensorOffset;

    float frontIntensity = getTrailIntensity(front);
    float frontLeftIntensity = getTrailIntensity(frontLeft);
    float frontRightIntensity = getTrailIntensity(frontRight);

    // Strongly discourage overcrowding while allowing to steer towards least crowded
    // position.
    frontIntensity -= max(0.0, frontIntensity - oneMinusCrowdAvoidance) * 10.0;
    frontLeftIntensity -= max(0.0, frontLeftIntensity - oneMinusCrowdAvoidance) * 10.0;
    frontRightIntensity -= max(0.0, frontRightIntensity - oneMinusCrowdAvoidance) * 10.0;

    float chosenIntensity = 0.0;

    if (frontIntensity > frontLeftIntensity && frontIntensity > frontRightIntensity) {
        agentDirectionAngle += 0.0;
        chosenIntensity = frontIntensity;
    } else if ((frontIntensity < frontLeftIntensity) && (frontIntensity < frontRightIntensity)) {
        agentDirectionAngle += rotationWeight * positiveOrNegative;
        chosenIntensity = positiveOrNegative < 0.0 ? frontRightIntensity : frontLeftIntensity;
    } else if (positiveOrNegative < 0.0) {
        if (frontLeftIntensity < frontRightIntensity) {
            agentDirectionAngle -= rotationWeight;
            chosenIntensity = frontRightIntensity;
        } else if (frontRightIntensity < frontLeftIntensity) {
            agentDirectionAngle += rotationWeight;
            chosenIntensity = frontLeftIntensity;
        }
    } else if (positiveOrNegative > 0.0) {
        if (frontRightIntensity < frontLeftIntensity) {
            agentDirectionAngle += rotationWeight;
            chosenIntensity = frontLeftIntensity;
        } else if (frontLeftIntensity < frontRightIntensity) {
            agentDirectionAngle -= rotationWeight;
            chosenIntensity = frontRightIntensity;
        }
    }

    agentDepositAmount += sign(chosenIntensity) * uDelta * 0.5;

    agentDepositAmount = clamp(agentDepositAmount, 0.0, 1.0);

    gl_FragColor = vec4(fract(agentPosition / uDisplayTextureResolution), fract(agentDirectionAngle / PI2), agentDepositAmount);
}