import { Bloom, EffectComposer } from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <>
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  );
}
