import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import SlimeStoreColorPicker from "../slime-store-color-picker/SlimeStoreColorPicker";
import SlimeStoreSlider from "../slime-store-slider/SlimeStoreSlider";
import ControlContainer from "./ControlContainer";
import ProceduralColorPalettePresetSelect from "./ProceduralColorPalettePresetSelect";

export default function ColorSettings() {
  // const colorSettings = useSlimeStore((state) => state.colorSettings);
  const slimeColorChangedAt = useSlimeStore(
    (state) => state.colorSettings.slimeColorChangedAt,
  );

  function handleProceduralColorPaletteChange(
    channel: "r" | "g" | "b",
    property: "yOffset" | "amplitude" | "frequency" | "phase",
    value: number,
  ) {
    useSlimeStore.setState(
      produce((state) => {
        state.colorSettings.proceduralColorPalette[channel][property] = value;
        state.colorSettings.slimeColorChangedAt = Date.now();
        state.footerState.isDimmedForEdit = true;
      }),
    );
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      useSlimeStore.setState(
        produce((state) => {
          state.footerState.isDimmedForEdit = false;
        }),
      );
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [slimeColorChangedAt]);

  return (
    <div className="mx-auto flex h-auto w-full max-w-sm flex-col bg-amber-200 p-1">
      <ControlContainer label="Background Color" collapsible>
        <SlimeStoreColorPicker
          storePath={["colorSettings", "backgroundColor"]}
        />
      </ControlContainer>
      <ControlContainer
        label="Procedural Color Palette"
        collapsible
        collapsed={false}
      >
        <ProceduralColorPalettePresetSelect />
        <ControlContainer label="Red" collapsible collapsed={false}>
          <SlimeStoreSlider
            label="Y-Offset"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "r",
              "yOffset",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("r", "yOffset", value)
            }
            min={-4}
            max={5}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Amplitude"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "r",
              "amplitude",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("r", "amplitude", value)
            }
            min={0}
            max={1}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Frequency"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "r",
              "frequency",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("r", "frequency", value)
            }
            min={0}
            max={10}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Phase"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "r",
              "phase",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("r", "phase", value)
            }
            min={Math.round(-Math.PI * 100) / 100}
            max={Math.round(Math.PI * 100) / 100}
            step={0.01}
          />
        </ControlContainer>
        <ControlContainer label="Green" collapsible collapsed={false}>
          <SlimeStoreSlider
            label="Y-Offset"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "g",
              "yOffset",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("g", "yOffset", value)
            }
            min={-4}
            max={5}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Amplitude"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "g",
              "amplitude",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("g", "amplitude", value)
            }
            min={0}
            max={1}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Frequency"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "g",
              "frequency",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("g", "frequency", value)
            }
            min={0}
            max={10}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Phase"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "g",
              "phase",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("g", "phase", value)
            }
            min={Math.round(-Math.PI * 100) / 100}
            max={Math.round(Math.PI * 100) / 100}
            step={0.01}
          />
        </ControlContainer>
        <ControlContainer label="Blue" collapsible collapsed={false}>
          <SlimeStoreSlider
            label="Y-Offset"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "b",
              "yOffset",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("b", "yOffset", value)
            }
            min={-4}
            max={5}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Amplitude"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "b",
              "amplitude",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("b", "amplitude", value)
            }
            min={0}
            max={1}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Frequency"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "b",
              "frequency",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("b", "frequency", value)
            }
            min={0}
            max={10}
            step={0.01}
          />
          <SlimeStoreSlider
            label="Phase"
            storePath={[
              "colorSettings",
              "proceduralColorPalette",
              "b",
              "phase",
            ]}
            onChange={(value) =>
              handleProceduralColorPaletteChange("b", "phase", value)
            }
            min={Math.round(-Math.PI * 100) / 100}
            max={Math.round(Math.PI * 100) / 100}
            step={0.01}
          />
        </ControlContainer>
      </ControlContainer>
    </div>
  );
}
