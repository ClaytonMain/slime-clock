import { produce } from "immer";
import * as R from "ramda";
import { useEffect } from "react";
import {
  COLOR_CONTROLS_CONFIGS,
  PALETTE_CYCLE_TYPE_OPTIONS,
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup";
import ProceduralColorPalettePresetSelect from "./ProceduralColorPalettePresetSelect";
import SlimeStoreColorPickerControl from "./SlimeStoreColorPickerControl";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
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
          defaultValue={[
            "quick-controls",
            "procedural-color-palette",
            "palette-offsets-and-tweaks",
          ]}
        >
          <AccordionControlsItem
            value="quick-controls"
            label="Quick Controls"
            labelHoverTabContentDisplay={["Quick Controls"]}
          >
            <ButtonControlGroup
              label="Quick Rand."
              labelHoverTabContentDisplay={[
                "Quick Randomization",
                "A set of buttons to quickly randomize various settings.",
              ]}
              buttonConfigs={[
                {
                  label: "Randomize All",
                  baseId: "quick-randomization-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.colorSettings.backgroundColorNeedsRandomization =
                          true;
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
                  },
                },
                {
                  label: "Randomize Background Color",
                  baseId: "randomize-background-color-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.colorSettings.backgroundColorNeedsRandomization =
                          true;
                      }),
                    );
                  },
                },
                {
                  label: "Randomize Color Palette",
                  baseId: "randomize-procedural-color-palette-button",
                  onClick: () => {
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
                  },
                },
              ]}
            />
            <ProceduralColorPalettePresetSelect />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="background-color"
            label="Background Color"
          >
            <SlimeStoreColorPickerControl
              label="Background Color"
              labelHoverTabContentDisplay={[
                "Background Color",
                "Does what it says on the box.",
              ]}
              baseId="background-color"
              storePath={["colorSettings", "backgroundColor"]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="procedural-color-palette"
            label="Procedural Color Palette"
          >
            <ButtonControlGroup
              buttonConfigs={[
                {
                  label: "Randomize Color Palette",
                  baseId: "procedural-color-palette-randomize",
                  onClick: () => {
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
                  },
                },
              ]}
            />
            <div className="flex flex-col gap-1 bg-red-500/5 p-2">
              <div className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-left text-lg leading-none font-medium">
                Red
              </div>
              <SlimeStoreSliderControl
                label="Red Y-Offset"
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
                label="Red Amplitude"
                baseInputId="procedural-color-palette-r-amplitude"
                min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.min}
                max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.max}
                step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.step}
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
                label="Red Frequency"
                baseInputId="procedural-color-palette-r-frequency"
                min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.min}
                max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.max}
                step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.step}
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
                label="Red Phase"
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
            </div>

            <SlimeStoreSliderControl
              label="Green Y-Offset"
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
              label="Green Amplitude"
              baseInputId="procedural-color-palette-g-amplitude"
              min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.min}
              max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.max}
              step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.step}
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
              label="Green Frequency"
              baseInputId="procedural-color-palette-g-frequency"
              min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.min}
              max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.max}
              step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.step}
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
              label="Green Phase"
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

            <SlimeStoreSliderControl
              label="Blue Y-Offset"
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
              label="Blue Amplitude"
              baseInputId="procedural-color-palette-b-amplitude"
              min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.min}
              max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.max}
              step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.amplitude!.step}
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
              label="Blue Frequency"
              baseInputId="procedural-color-palette-b-frequency"
              min={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.min}
              max={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.max}
              step={PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS.frequency!.step}
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
              label="Blue Phase"
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

          <AccordionControlsItem
            value="palette-offsets-and-tweaks"
            label="Palette Offsets & Tweaks"
            padContent={false}
          >
            <SlimeStoreSelectControl
              label="Palette Cycle Type"
              baseInputId="procedural-color-palette-cycle-type-select"
              placeholder="Palette Cycle Type"
              storePath={["colorSettings", "paletteCycleType"]}
              options={PALETTE_CYCLE_TYPE_OPTIONS}
              valueType="number"
            />
            <SlimeStoreSliderControl
              label="Intensity Smoothing"
              baseInputId="intensity-smoothing"
              min={COLOR_CONTROLS_CONFIGS.intensitySmoothing!.min}
              max={COLOR_CONTROLS_CONFIGS.intensitySmoothing!.max}
              step={COLOR_CONTROLS_CONFIGS.intensitySmoothing!.step}
              storePath={["colorSettings", "intensitySmoothing"]}
            />
            <SlimeStoreSliderControl
              label="Agent Direction Smoothing"
              baseInputId="agent-direction-smoothing"
              min={COLOR_CONTROLS_CONFIGS.agentDirectionSmoothing!.min}
              max={COLOR_CONTROLS_CONFIGS.agentDirectionSmoothing!.max}
              step={COLOR_CONTROLS_CONFIGS.agentDirectionSmoothing!.step}
              storePath={["colorSettings", "agentDirectionSmoothing"]}
            />
            <SlimeStoreSliderControl
              label="Agent Direction Color Offset"
              baseInputId="agent-direction-color-offset"
              min={COLOR_CONTROLS_CONFIGS.agentDirectionColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.agentDirectionColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.agentDirectionColorOffset!.step}
              storePath={["colorSettings", "agentDirectionColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="Clock Color Offset"
              baseInputId="clock-color-offset"
              min={COLOR_CONTROLS_CONFIGS.clockColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.clockColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.clockColorOffset!.step}
              storePath={["colorSettings", "clockColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="X Color Offset"
              baseInputId="x-color-offset"
              min={COLOR_CONTROLS_CONFIGS.xColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.xColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.xColorOffset!.step}
              storePath={["colorSettings", "xColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="Y Color Offset"
              baseInputId="y-color-offset"
              min={COLOR_CONTROLS_CONFIGS.yColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.yColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.yColorOffset!.step}
              storePath={["colorSettings", "yColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="Palette Cycle Speed"
              baseInputId="procedural-color-palette-cycle-speed"
              min={COLOR_CONTROLS_CONFIGS.paletteCycleSpeed!.min}
              max={COLOR_CONTROLS_CONFIGS.paletteCycleSpeed!.max}
              step={COLOR_CONTROLS_CONFIGS.paletteCycleSpeed!.step}
              storePath={["colorSettings", "paletteCycleSpeed"]}
              labelHoverTabContentDisplay={[
                "Palette Cycle Speed",
                "The speed at which the procedural color palette cycles through colors.",
              ]}
            />
            <SlimeStoreSliderControl
              label="Palette Cycle Scale"
              baseInputId="procedural-color-palette-cycle-scale"
              min={COLOR_CONTROLS_CONFIGS.paletteCycleScale!.min}
              max={COLOR_CONTROLS_CONFIGS.paletteCycleScale!.max}
              step={COLOR_CONTROLS_CONFIGS.paletteCycleScale!.step}
              storePath={["colorSettings", "paletteCycleScale"]}
              labelHoverTabContentDisplay={["Palette Cycle Scale"]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
