import * as THREE from "three";
import fragmentShader from "./shaders/agent-positions/agentPositions.frag";
import vertexShader from "./shaders/agent-positions/agentPositions.vert";
import { getAgentPositionsTexture } from "./utils/utils";

class AgentPositionsMaterial extends THREE.ShaderMaterial {
  constructor(
    displayTextureWidth: number,
    displayTextureHeight: number,
    uniforms: { [uniform: string]: THREE.IUniform },
  ) {
    const agentPositionsTexture = getAgentPositionsTexture(
      displayTextureWidth,
      displayTextureHeight,
    );

    const agentPositionsUniforms = {
      ...uniforms,
      uAgentPositionsTexture: { value: agentPositionsTexture },
    };

    super({
      uniforms: agentPositionsUniforms,
      vertexShader,
      fragmentShader,
    });
  }
}

export default AgentPositionsMaterial;
