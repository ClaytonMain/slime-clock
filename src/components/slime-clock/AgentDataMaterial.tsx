import * as THREE from "three";
import fragmentShader from "./shaders/agent-data/agentData.frag";
import vertexShader from "./shaders/agent-data/agentData.vert";
import { getAgentDataTexture } from "./utils/utils";

class AgentDataMaterial extends THREE.ShaderMaterial {
  constructor(
    gpuTextureWidth: number,
    gpuTextureHeight: number,
    uniforms: { [uniform: string]: THREE.IUniform },
    displayWidth: number,
    displayHeight: number,
    startType: number = -1,
  ) {
    const agentDataTexture = getAgentDataTexture(
      gpuTextureWidth,
      gpuTextureHeight,
      displayWidth,
      displayHeight,
      startType,
    );

    const agentDataUniforms = {
      ...uniforms,
      uAgentDataTexture: { value: agentDataTexture },
    };

    super({
      uniforms: agentDataUniforms,
      vertexShader,
      fragmentShader,
    });
  }
}

export default AgentDataMaterial;
