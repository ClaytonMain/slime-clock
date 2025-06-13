import { produce } from "immer";
import useSlimeStore from "../../stores/useSlimeStore";
import SlimeStoreColorPicker from "../slime-store-color-picker/SlimeStoreColorPicker";
import SlimeStoreSlider from "../slime-store-slider/SlimeStoreSlider";
import ControlContainer from "./ControlContainer";
import FooterTabContent from "./FooterTabContent";

export default function ColorSettings() {
  // const colorSettings = useSlimeStore((state) => state.colorSettings);

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
    const timeoutId = setTimeout(() => {
      useSlimeStore.setState(
        produce((state) => {
          state.footerState.isDimmedForEdit = false;
        }),
      );
    }, 1000);
    return () => clearTimeout(timeoutId);
  }

  return (
    <FooterTabContent tabName="simulation-settings" key="simulation-settings">
      <div className="mx-auto flex h-auto w-full max-w-sm flex-col bg-amber-200 p-1">
        <SlimeStoreColorPicker
          label="Background Color"
          storePath={["colorSettings", "backgroundColor"]}
        />
        <ControlContainer>
          <label className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
            {"Red"}
          </label>
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
            displayLabel={"left"}
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
            displayLabel={"left"}
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
            displayLabel={"left"}
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
            displayLabel={"left"}
          />
        </ControlContainer>
        <ControlContainer>
          <label className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
            {"Green"}
          </label>
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
            displayLabel={"left"}
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
            displayLabel={"left"}
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
            displayLabel={"left"}
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
            displayLabel={"left"}
          />
        </ControlContainer>
        <ControlContainer>
          <label className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
            {"Blue"}
          </label>
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
            displayLabel={"left"}
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
            displayLabel={"left"}
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
            displayLabel={"left"}
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
            displayLabel={"left"}
          />
        </ControlContainer>
      </div>
    </FooterTabContent>
  );
}
