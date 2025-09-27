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
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup";
import ControlGroup from "./ControlGroup";
import SaveCurrentSettingsAsPresetPopoverButton from "./SaveCurrentSettingsAsPresetPopoverButton";
import SimulationPresetLoadSaveControl from "./SimulationPresetLoadSaveControl";
import SlimeStoreColorPickerControl from "./SlimeStoreColorPickerControl";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import SwitchControlGroup from "./SwitchControlGroup";
import TabContentContainer from "./TabContentContainer";
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
            labelHoverTabContentDisplay={["Randomization Controls"]}
          >
            <SlimeStoreSwitchControl
              label="Color Auto Rand. Enabled"
              labelHoverTabContentDisplay={[]}
              baseId="color-auto-randomization-enabled-switch"
              storePath={[
                "randomizationSettings",
                "colorAutoRandomizationEnabled",
              ]}
            />
            <SlimeStoreSliderControl
              label="Color Auto Rand. Interval"
              labelHoverTabContentDisplay={[]}
              baseInputId="color-auto-randomization-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={[
                "randomizationSettings",
                "colorAutoRandomizationInterval",
              ]}
            />
            <SlimeStoreSelectControl
              label="Color Auto Rand. Mode"
              labelHoverTabContentDisplay={[]}
              baseInputId="randomization-controls-color-auto-randomization-mode-select"
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
            <SwitchControlGroup
              label="Enabled Rands."
              labelHoverTabContentDisplay={[
                "Enabled Randomizations",
                "Toggles to enable or disable randomization for various setting groups.",
              ]}
              switchConfigs={[
                {
                  label: "Color Settings",
                  baseId: "color-settings-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowColorRandomization",
                  ],
                },
              ]}
            />
            <ButtonControlGroup
              label="Quick Rand."
              labelHoverTabContentDisplay={[
                "Quick Randomization",
                "A set of buttons to quickly randomize various settings.",
              ]}
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
            labelHoverTabContentDisplay={["Presets"]}
          >
            <ControlGroup justifyContent="center">
              <SaveCurrentSettingsAsPresetPopoverButton presetType="Color Only" />
            </ControlGroup>
            <ButtonControlGroup
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
