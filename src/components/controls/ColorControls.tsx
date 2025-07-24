import { produce } from "immer";
import * as R from "ramda";
import { useEffect } from "react";
import { PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ControlButton from "./ControlButton";
import ProceduralColorPalettePresetSelect from "./ProceduralColorPalettePresetSelect";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function ColorControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  const colorControlsLabelHoverTabContentDisplay = [
    "Color Controls",
    "Controls related to the color settings.",
  ];

  useEffect(() => {
    if (selectedTab !== "color-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          colorControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function handleOnValueChange(value: number[], storePath: string[]) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaContentName = "procedural-color-palette";
        state.controlsState.displayAreaContentType = "three";
        state.colorSettings.slimeColorChangedAt = Date.now();
      }),
    );
    useSlimeStore.setState(R.over(R.lensPath(storePath), () => value[0]));
  }

  return (
    <TabContentContainer tabsValue="color-controls">
      <TabContentScrollArea title="Color">
        <AccordionControlsWrapper
          type="multiple"
          defaultValue={["procedural-color-palette"]}
        >
          <AccordionControlsItem
            value="procedural-color-palette"
            label="Procedural Color Palette"
            padContent={false}
          >
            <ControlButton
              label="Randomize Color Palette"
              baseId="procedural-color-palette-randomize-button"
              onClick={() => {
                useSlimeStore.setState(
                  produce((state) => {
                    state.colorSettings.proceduralColorPaletteNeedsRandomization =
                      true;
                    state.colorSettings.slimeColorChangedAt = Date.now();
                    state.controlsState.displayAreaContentName =
                      "procedural-color-palette";
                    state.controlsState.displayAreaContentType = "three";
                    state.controlsState.displayAreaHtmlContent = null;
                    state.controlsState.displayAreaContentUpdatedAt =
                      Date.now();
                  }),
                );
              }}
            />
            <ProceduralColorPalettePresetSelect />
            <AccordionControlsWrapper
              type="multiple"
              defaultValue={["red", "green", "blue"]}
            >
              <AccordionControlsItem value="red" label="Red">
                <SlimeStoreSliderControl
                  label="Y-Offset"
                  baseInputId="procedural-color-palette-r-y-offset"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.max}
                  step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.step}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "yOffset",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "yOffset",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Amplitude"
                  baseInputId="procedural-color-palette-r-amplitude"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.max}
                  step={
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.step
                  }
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "amplitude",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "amplitude",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Frequency"
                  baseInputId="procedural-color-palette-r-frequency"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.max}
                  step={
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.step
                  }
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "frequency",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "frequency",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Phase"
                  baseInputId="procedural-color-palette-r-phase"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.max}
                  step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.step}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "phase",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "phase",
                    ])
                  }
                />
              </AccordionControlsItem>
              <AccordionControlsItem value="green" label="Green">
                <SlimeStoreSliderControl
                  label="Y-Offset"
                  baseInputId="procedural-color-palette-g-y-offset"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.max}
                  step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.step}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "yOffset",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "yOffset",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Amplitude"
                  baseInputId="procedural-color-palette-g-amplitude"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.max}
                  step={
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.step
                  }
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "amplitude",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "amplitude",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Frequency"
                  baseInputId="procedural-color-palette-g-frequency"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.max}
                  step={
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.step
                  }
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "frequency",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "frequency",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Phase"
                  baseInputId="procedural-color-palette-g-phase"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.max}
                  step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.step}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "phase",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "phase",
                    ])
                  }
                />
              </AccordionControlsItem>
              <AccordionControlsItem value="blue" label="Blue">
                <SlimeStoreSliderControl
                  label="Y-Offset"
                  baseInputId="procedural-color-palette-b-y-offset"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.max}
                  step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.yOffset!.step}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "yOffset",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "yOffset",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Amplitude"
                  baseInputId="procedural-color-palette-b-amplitude"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.max}
                  step={
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.step
                  }
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "amplitude",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "amplitude",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Frequency"
                  baseInputId="procedural-color-palette-b-frequency"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.max}
                  step={
                    PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.step
                  }
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "frequency",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "frequency",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="Phase"
                  baseInputId="procedural-color-palette-b-phase"
                  min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.min}
                  max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.max}
                  step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.phase!.step}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "phase",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "phase",
                    ])
                  }
                />
              </AccordionControlsItem>
            </AccordionControlsWrapper>
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
