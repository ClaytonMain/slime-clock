import { produce } from "immer";
import * as R from "ramda";
import { useEffect } from "react";
import {
  COLOR_CONTROLS_CONFIGS,
  PALETTE_CYCLE_TYPE_OPTIONS,
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
} from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { LoadableSlimeStoreSettings } from "../../types/types";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup";
import ControlGroup from "./ControlGroup";
import SaveCurrentSettingsAsPresetPopoverButton from "./SaveCurrentSettingsAsPresetPopoverButton";
import SimulationPresetLoadSaveControl from "./SimulationPresetLoadSaveControl";
import SlimeStoreColorPickerControl from "./SlimeStoreColorPickerControl";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
import SlimeStoreSlider from "./SlimeStoreSlider";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitch from "./SlimeStoreSwitch";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import TabContentContainer from "./TabContentContainer";
import TabContentDisplayAreaContentWrapper from "./TabContentDisplayAreaContentWrapper";
import TabContentScrollArea from "./TabContentScrollArea";

export default function ColorControls() {
  const sortedSimulationPresets = useSlimeStore(
    (state) => state.sortedSimulationPresets,
  );
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
        state.controlsState.displayAreaContentName = null;
        state.controlsState.hideDisplayAreaBackground = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function handleOnValueChange(value: number[], storePath: string[]) {
    useSlimeStore.setState(R.over(R.lensPath(storePath), () => value[0]));
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaContentName = "procedural-color-palette";
        state.controlsState.displayAreaHtmlContent = null;
        state.controlsState.hideDisplayAreaBackground = false;
        state.colorSettings.slimeColorChangedAt = Date.now();
      }),
    );
  }

  function getPresetIndex(preset: LoadableSlimeStoreSettings) {
    const presets = useSlimeStore.getState().simulationPresets;
    return presets.findIndex(
      (p) => p.name === preset.name && p.presetType === preset.presetType,
    );
  }

  function updateNeededRandomizations(settings: string[]) {
    const randomizationSettings =
      useSlimeStore.getState().randomizationSettings;
    const randomized: string[] = [];
    const notRandomized: string[] = [];
    useSlimeStore.setState(
      produce((state) => {
        settings.forEach((setting) => {
          switch (setting) {
            case "color":
              state.randomizationState.colorRandomizationRequestedAt =
                Date.now();
              if (randomizationSettings.allowColorRandomization) {
                randomized.push("color");
              } else {
                notRandomized.push("color");
              }
              break;
          }
        });
        if (settings.length === 1) {
          if (randomized.length === 1) {
            state.toast.title = "Randomization Applied";
            state.toast.description = `The ${randomized[0]} settings have been randomized.`;
            state.toast.type = "success";
            state.toast.lastTriggeredAt = Date.now();
          } else if (notRandomized.length === 1) {
            state.toast.title = "Randomization Skipped";
            state.toast.description = `Randomization for ${notRandomized[0]} settings is disabled.`;
            state.toast.type = "error";
            state.toast.lastTriggeredAt = Date.now();
          }
        } else if (settings.length > 1) {
          const descriptionArray: string[] = [];
          if (randomized.length > 0) {
            descriptionArray.push(`Randomized: ${randomized.join(", ")}.`);
          }
          if (notRandomized.length > 0) {
            descriptionArray.push(`Skipped: ${notRandomized.join(", ")}.`);
          }
          let toastType = "info";
          if (randomized.length === settings.length) {
            toastType = "success";
          } else if (notRandomized.length === settings.length) {
            toastType = "error";
          }
          state.toast.title = "Randomization Info";
          state.toast.description = descriptionArray.join("\n");
          state.toast.type = toastType;
          state.toast.lastTriggeredAt = Date.now();
        }
      }),
    );
  }

  function setAutoLoadOnRandAll(value: boolean) {
    let simulationPresets = [...useSlimeStore.getState().simulationPresets];
    simulationPresets = simulationPresets.map((preset) => {
      const modifiedPreset = { ...preset };
      if (["Combination", "Color Only"].includes(preset.presetType)) {
        modifiedPreset.enabled = value;
      }
      return modifiedPreset;
    });
    useSlimeStore.setState(
      produce((state) => {
        state.simulationPresets = simulationPresets;
        state.toast.title = "Auto Load on Rand. Updated";
        state.toast.description = `All "color" and "combination" presets have been ${value ? "enabled" : "disabled"} for load on auto-randomization.`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
  }

  return (
    <TabContentContainer tabsValue="color-controls">
      <TabContentScrollArea title="Color">
        <AccordionControlsWrapper
          accordionId="color-controls-accordion"
          type="multiple"
          defaultValue={[
            "randomization-controls",
            "color-controls-presets",
            "color-controls-color-settings",
          ]}
        >
          <AccordionControlsItem
            value="randomization-controls"
            label="Randomization Controls"
            labelHoverTabContentDisplay={[
              "Randomization Controls",
              "A few color-related randomization controls. More robust randomization controls can be found in the 'Randomization Controls' tab (the dice icon below).",
            ]}
          >
            <ControlGroup
              label="Color Auto Rand."
              labelHoverTabContentDisplay={[
                "Color Auto Randomization",
                <TabContentDisplayAreaContentWrapper>
                  Allows the color settings to randomize certain enabled
                  parameters at set intervals. The{" "}
                  <CodeBlock>enabled</CodeBlock> switch toggles
                  auto-randomization for the color settings. The{" "}
                  <CodeBlock>interval</CodeBlock> slider controls how often the
                  randomization occurs (in minutes). Auto-randomization is
                  disabled while the control panel is open.
                </TabContentDisplayAreaContentWrapper>,
              ]}
            >
              <SlimeStoreSwitch
                baseId="rand-controls-color-auto-randomization-enabled-switch"
                storePath={[
                  "randomizationSettings",
                  "colorAutoRandomizationEnabled",
                ]}
                switchLabel="Enabled"
              />
              <div className="flex-grow">
                <SlimeStoreSlider
                  baseInputId="rand-controls-color-auto-randomization-interval-slider"
                  min={1}
                  max={60}
                  step={1}
                  storePath={[
                    "randomizationSettings",
                    "colorAutoRandomizationInterval",
                  ]}
                  sliderLabel="Interval"
                />
              </div>
            </ControlGroup>
            <SlimeStoreSelectControl
              label="Color Auto Rand. Mode"
              labelHoverTabContentDisplay={[
                "Color Auto Randomization Mode",
                <TabContentDisplayAreaContentWrapper>
                  <ul className="list-inside list-disc">
                    <li>
                      <em>Use Random Enabled Randomization Preset: </em>
                      Randomly loads one of the <em>enabled</em> randomization
                      presets from the <em>Simulation Randomization Presets</em>
                      section below prior to randomizing the color settings. The
                      settings in the <em>Color Randomization Settings</em>{" "}
                      section are overwritten by the loaded preset.
                    </li>
                    <li>
                      <em>Use Random Enabled Color Preset: </em>
                      Randomly loads one of the <em>enabled</em> color presets
                      from the <em>Color Presets</em> tab prior to randomizing
                      the color settings.
                    </li>
                    <li>
                      <em>Use Current Randomization Settings: </em>
                      Uses the current randomization settings without loading
                      any presets.
                    </li>
                  </ul>
                </TabContentDisplayAreaContentWrapper>,
              ]}
              baseInputId="rand-controls-color-auto-randomization-mode-select"
              storePath={[
                "randomizationSettings",
                "colorAutoRandomizationMode",
              ]}
              options={[
                {
                  label: "Use Random Enabled Randomization Preset",
                  value: "selectEnabledRandomizationPreset",
                },
                {
                  label: "Use Random Enabled Color Preset",
                  value: "selectEnabledColorPreset",
                },
                {
                  label: "Use Current Randomization Settings",
                  value: "useCurrentRandomizationSettings",
                },
              ]}
            />
            <SlimeStoreSwitchControl
              label="Allow Color Rand."
              labelHoverTabContentDisplay={[
                "Allow Color Randomization",
                "Enables or disables color randomization. This toggles randomization completely - independent of the auto-randomization toggle above. Auto-randomization will not randomize color settings if this is disabled.",
              ]}
              baseId="color-randomization-enabled-switch"
              storePath={["randomizationSettings", "allowColorRandomization"]}
            />
            <ButtonControlGroup
              labelHoverTabContentDisplay={[
                "Randomize Color Settings",
                "Randomizes the color settings using the current randomization settings on the Randomization Controls tab (the dice icon below). Will not randomize if color randomization is disabled.",
              ]}
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Randomize Color Settings",
                  baseId:
                    "color-controls-quick-rand-rand-color-settings-button",
                  onClick: () => {
                    updateNeededRandomizations(["color"]);
                  },
                },
              ]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="color-controls-presets"
            label="Presets"
            labelHoverTabContentDisplay={[
              "Presets",
              "Manage and save color presets. Default presets cannot be overwritten or deleted.",
            ]}
          >
            <ControlGroup
              labelHoverTabContentDisplay={[
                "Save Current Settings as Preset",
                "Allows you to save the current color settings as a preset. Clicking this button will open a dialog to enter the preset name prior to saving. All color preset names must be unique. You can manage and apply your saved presets below. Default presets cannot be overwritten or deleted.",
              ]}
              justifyContent="center"
            >
              <SaveCurrentSettingsAsPresetPopoverButton presetType="Color Only" />
            </ControlGroup>
            <ButtonControlGroup
              labelHoverTabContentDisplay={[
                "Enable/Disable Load on Auto Rand - All Color Presets",
                <TabContentDisplayAreaContentWrapper>
                  Enables or disables all color presets for load on auto
                  randomization. When the color auto-randomization mode is set
                  to <em>Use Random Enabled Color Preset</em>, one of the
                  enabled color presets will be randomly loaded when the color
                  settings are auto-randomized.
                </TabContentDisplayAreaContentWrapper>,
              ]}
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Auto Load on Rand - All Color Presets",
                  baseId: "enable-auto-load-on-rand-all-color-button",
                  onClick: () => setAutoLoadOnRandAll(true),
                },
                {
                  label: "Disable Auto Load on Rand - All Color Presets",
                  baseId: "disable-auto-load-on-rand-all-color-button",
                  onClick: () => setAutoLoadOnRandAll(false),
                },
              ]}
            />
            {sortedSimulationPresets["Color Only"] &&
              sortedSimulationPresets["Color Only"].map((preset) => (
                <SimulationPresetLoadSaveControl
                  key={preset.name}
                  label={preset.name}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  settings={preset}
                  controlType="presets"
                  index={getPresetIndex(preset)}
                />
              ))}
            {sortedSimulationPresets["Combination"] &&
              sortedSimulationPresets["Combination"].map((preset) => (
                <SimulationPresetLoadSaveControl
                  key={preset.name}
                  label={preset.name}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  settings={preset}
                  controlType="presets"
                  index={getPresetIndex(preset)}
                />
              ))}
          </AccordionControlsItem>

          <AccordionControlsItem
            value="color-controls-color-settings"
            label="Color Settings"
            labelHoverTabContentDisplay={[
              "Color Settings",
              <TabContentDisplayAreaContentWrapper>
                Controls to modify the color settings. For information on how
                the procedural color palette (the "Red", "Green", and "Blue"
                sliders below) works see{" "}
                <a
                  href="https://iquilezles.org/articles/palettes/"
                  className="text-sky-400 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  this article
                </a>{" "}
                by Iñigo Quílez.
              </TabContentDisplayAreaContentWrapper>,
            ]}
          >
            <SlimeStoreColorPickerControl
              label="Background Color"
              labelHoverTabContentDisplay={[
                "Background Color",
                "Sows chaos and woe. Or sets the background color. One of those.",
              ]}
              baseId="background-color"
              storePath={["colorSettings", "backgroundColor"]}
            />

            <SlimeStoreSliderControl
              label="Red Y-Offset"
              labelHoverTabContentDisplay={[
                "Red Y-Offset",
                "Controls the y-offset of the red cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Red Amplitude",
                "Controls the amplitude of the red cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Red Frequency",
                "Controls the frequency of the red cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Red Phase",
                "Controls the phase of the red cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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

            <SlimeStoreSliderControl
              label="Green Y-Offset"
              labelHoverTabContentDisplay={[
                "Green Y-Offset",
                "Controls the y-offset of the green cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Green Amplitude",
                "Controls the amplitude of the green cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Green Frequency",
                "Controls the frequency of the green cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Green Phase",
                "Controls the phase of the green cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Blue Y-Offset",
                "Controls the y-offset of the blue cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Blue Amplitude",
                "Controls the amplitude of the blue cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Blue Frequency",
                "Controls the frequency of the blue cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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
              labelHoverTabContentDisplay={[
                "Blue Phase",
                "Controls the phase of the blue cosine wave used to generate the procedural color palette. Move the slider to see how it affects the colors.",
              ]}
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

            <SlimeStoreSelectControl
              label="Palette Cycle Type"
              labelHoverTabContentDisplay={[
                "Palette Cycle Type",
                <TabContentDisplayAreaContentWrapper>
                  Determines how the procedural color palette cycles through
                  colors over time.
                  <ul className="list-inside list-disc">
                    <li>
                      <em>Oscilating: </em>
                      The color oscillates smoothly back and forth through the
                      gradient you see in the display area.
                    </li>
                    <li>
                      <em>Repeating: </em>
                      The color cycles through the gradient you see in the
                      display area in one direction, jumping back to the start
                      when it reaches the end.
                    </li>
                    <li>
                      <em>Continuous: </em>
                      The color cycles through the gradient in one direction,
                      continuing past the colors displayed in the display area.
                    </li>
                  </ul>
                </TabContentDisplayAreaContentWrapper>,
              ]}
              baseInputId="procedural-color-palette-cycle-type-select"
              placeholder="Palette Cycle Type"
              storePath={["colorSettings", "paletteCycleType"]}
              options={PALETTE_CYCLE_TYPE_OPTIONS}
              valueType="number"
            />
            <SlimeStoreSliderControl
              label="Intensity Smoothing"
              labelHoverTabContentDisplay={[
                "Intensity Smoothing",
                "Basically the graininess or smoothness of the colors. Just mess with the slider and you'll see what it does.",
              ]}
              baseInputId="intensity-smoothing"
              min={COLOR_CONTROLS_CONFIGS.intensitySmoothing!.min}
              max={COLOR_CONTROLS_CONFIGS.intensitySmoothing!.max}
              step={COLOR_CONTROLS_CONFIGS.intensitySmoothing!.step}
              storePath={["colorSettings", "intensitySmoothing"]}
            />
            <SlimeStoreSliderControl
              label="Agent Direction Smoothing"
              labelHoverTabContentDisplay={[
                "Agent Direction Smoothing",
                "In theory, how smoothly the agent direction affects the color. Doesn't do much of anything noticeable, tbh.",
              ]}
              baseInputId="agent-direction-smoothing"
              min={COLOR_CONTROLS_CONFIGS.agentDirectionSmoothing!.min}
              max={COLOR_CONTROLS_CONFIGS.agentDirectionSmoothing!.max}
              step={COLOR_CONTROLS_CONFIGS.agentDirectionSmoothing!.step}
              storePath={["colorSettings", "agentDirectionSmoothing"]}
            />
            <SlimeStoreSliderControl
              label="Agent Direction Color Offset"
              labelHoverTabContentDisplay={[
                "Agent Direction Color Offset",
                "Controls how much agent direction offsets the color cycle.",
              ]}
              baseInputId="agent-direction-color-offset"
              min={COLOR_CONTROLS_CONFIGS.agentDirectionColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.agentDirectionColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.agentDirectionColorOffset!.step}
              storePath={["colorSettings", "agentDirectionColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="Clock Color Offset"
              labelHoverTabContentDisplay={[
                "Clock Color Offset",
                "Controls how much the color cycle is offset by for portions of the trail overlapping the clock.",
              ]}
              baseInputId="clock-color-offset"
              min={COLOR_CONTROLS_CONFIGS.clockColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.clockColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.clockColorOffset!.step}
              storePath={["colorSettings", "clockColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="X Color Offset"
              labelHoverTabContentDisplay={[
                "X Color Offset",
                "Controls how much the color cycle is offset by the x-position of the pixel.",
              ]}
              baseInputId="x-color-offset"
              min={COLOR_CONTROLS_CONFIGS.xColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.xColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.xColorOffset!.step}
              storePath={["colorSettings", "xColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="Y Color Offset"
              labelHoverTabContentDisplay={[
                "Y Color Offset",
                "Controls how much the color cycle is offset by the y-position of the pixel.",
              ]}
              baseInputId="y-color-offset"
              min={COLOR_CONTROLS_CONFIGS.yColorOffset!.min}
              max={COLOR_CONTROLS_CONFIGS.yColorOffset!.max}
              step={COLOR_CONTROLS_CONFIGS.yColorOffset!.step}
              storePath={["colorSettings", "yColorOffset"]}
            />
            <SlimeStoreSliderControl
              label="Palette Cycle Speed"
              labelHoverTabContentDisplay={[
                "Palette Cycle Speed",
                "The speed at which the procedural color palette cycles through colors.",
              ]}
              baseInputId="procedural-color-palette-cycle-speed"
              min={COLOR_CONTROLS_CONFIGS.paletteCycleSpeed!.min}
              max={COLOR_CONTROLS_CONFIGS.paletteCycleSpeed!.max}
              step={COLOR_CONTROLS_CONFIGS.paletteCycleSpeed!.step}
              storePath={["colorSettings", "paletteCycleSpeed"]}
            />
            <SlimeStoreSliderControl
              label="Palette Cycle Scale"
              labelHoverTabContentDisplay={[
                "Palette Cycle Scale",
                <TabContentDisplayAreaContentWrapper>
                  <strong className="text-rose-400">Warning:</strong> Causes a
                  flashing effect when moving the slider.
                  <br />
                  Controls how much of the gradient is visible at once. Higher
                  values display more of the gradient.
                </TabContentDisplayAreaContentWrapper>,
              ]}
              baseInputId="procedural-color-palette-cycle-scale"
              min={COLOR_CONTROLS_CONFIGS.paletteCycleScale!.min}
              max={COLOR_CONTROLS_CONFIGS.paletteCycleScale!.max}
              step={COLOR_CONTROLS_CONFIGS.paletteCycleScale!.step}
              storePath={["colorSettings", "paletteCycleScale"]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
