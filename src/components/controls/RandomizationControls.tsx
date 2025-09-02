import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup";
import ControlGroup from "./ControlGroup";
import RandomizationPresetLoadSaveControl from "./RandomizationPresetLoadSaveControl";
import SaveRandomizationPresetPopoverButton from "./SaveRandomizationPresetPopoverButton";
import SlimeStoreNumericRangeRandomizationControl from "./SlimeStoreNumericRangeRandomizationControl";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import SwitchControlGroup from "./SwitchControlGroup";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function RandomizationControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const randomizationPresets = useSlimeStore(
    (state) => state.randomizationPresets,
  );

  const randomizationControlsLabelHoverTabContentDisplay = [
    "Randomization Controls",
    "Controls related to the what can be randomized and when.",
  ];

  useEffect(() => {
    if (selectedTab !== "randomization-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          randomizationControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function updateNeededRandomizations(settings: string[]) {
    useSlimeStore.setState(
      produce((state) => {
        settings.forEach((setting) => {
          switch (setting) {
            case "agents":
              state.randomizationState.agentRandomizationRequestedAt =
                Date.now();
              break;
            case "trail":
              state.randomizationState.trailRandomizationRequestedAt =
                Date.now();
              break;
            case "palette":
              state.randomizationState.proceduralColorPaletteRandomizationRequestedAt =
                Date.now();
              break;
            case "background":
              state.randomizationState.backgroundColorRandomizationRequestedAt =
                Date.now();
              break;
          }
        });
      }),
    );
  }

  return (
    <TabContentContainer tabsValue="randomization-controls">
      <TabContentScrollArea title="Randomization">
        <AccordionControlsWrapper
          accordionId="randomization-controls-accordion"
          type="multiple"
          defaultValue={["quick-controls"]}
        >
          <AccordionControlsItem
            value="quick-controls"
            label="Quick Controls"
            labelHoverTabContentDisplay={[
              "Quick Controls",
              "Allows quick access to randomization toggles and buttons.",
            ]}
          >
            <SlimeStoreSwitchControl
              label="Auto Rand. Enabled"
              labelHoverTabContentDisplay={[
                "Auto Randomization Enabled",
                'Allows the simulation to randomize certain parameters at set intervals. The randomization interval is set using the \'Randomization Interval\' slider. Control over which parameters are randomized can be found in the "Agent Randomization Settings" and "Trail Randomization Settings" accordions below. Auto randomization is disabled when the controls are open.',
              ]}
              baseId="auto-randomization-enabled-switch"
              storePath={["randomizationSettings", "autoRandomizationEnabled"]}
            />
            <SlimeStoreSliderControl
              label="Auto Rand. Interval"
              labelHoverTabContentDisplay={[]}
              baseInputId="auto-randomization-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={["randomizationSettings", "autoRandomizationInterval"]}
            />
            <SlimeStoreSwitchControl
              label="Auto Restart Enabled"
              labelHoverTabContentDisplay={[]}
              baseId="auto-restart-enabled-switch"
              storePath={["randomizationSettings", "autoRestartEnabled"]}
            />
            <SlimeStoreSliderControl
              label="Auto Restart Interval"
              labelHoverTabContentDisplay={[]}
              baseInputId="auto-restart-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={["randomizationSettings", "autoRestartInterval"]}
            />
            <SwitchControlGroup
              label="Enabled Rands."
              labelHoverTabContentDisplay={[
                "Enabled Randomizations",
                "Toggles to enable or disable randomization for various setting groups.",
              ]}
              switchConfigs={[
                {
                  label: "Agents",
                  baseId: "agent-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowAgentRandomization",
                  ],
                },
                {
                  label: "Trail",
                  baseId: "trail-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowTrailRandomization",
                  ],
                },
                {
                  label: "Color Palette",
                  baseId: "color-palette-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowProceduralColorPaletteRandomization",
                  ],
                },
                {
                  label: "Background Color",
                  baseId: "background-color-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowBackgroundColorRandomization",
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
                  label: "Restart Simulation",
                  baseId: "restart-simulation-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.randomizationState.simulationRestartRequestedAt =
                          Date.now();
                      }),
                    );
                  },
                },
                {
                  label: "Randomize All",
                  baseId: "randomize-all-button",
                  onClick: () => {
                    updateNeededRandomizations([
                      "agents",
                      "trail",
                      "palette",
                      "background",
                    ]);
                  },
                },
                {
                  label: "Randomize Agents",
                  baseId: "randomize-agents-button",
                  onClick: () => {
                    updateNeededRandomizations(["agents"]);
                  },
                },
                {
                  label: "Randomize Trail",
                  baseId: "randomize-trail-button",
                  onClick: () => {
                    updateNeededRandomizations(["trail"]);
                  },
                },
                {
                  label: "Randomize Palette",
                  baseId: "randomize-palette-button",
                  onClick: () => {
                    updateNeededRandomizations(["palette"]);
                  },
                },
                {
                  label: "Randomize Background",
                  baseId: "randomize-background-button",
                  onClick: () => {
                    updateNeededRandomizations(["background"]);
                  },
                },
              ]}
            />
            <ControlGroup justifyContent="center">
              <SaveRandomizationPresetPopoverButton randomizationPresetType="simulation" />
              <SaveRandomizationPresetPopoverButton randomizationPresetType="color" />
            </ControlGroup>
          </AccordionControlsItem>
          <AccordionControlsItem
            value="simulation-randomization-setting-presets"
            label="Simulation Randomization Presets"
            labelHoverTabContentDisplay={[
              "Simulation Randomization Presets",
              "Manage and apply presets for simulation randomization settings.",
            ]}
          >
            <ControlGroup justifyContent="center">
              <SaveRandomizationPresetPopoverButton randomizationPresetType="simulation" />
            </ControlGroup>
            {randomizationPresets.map((preset, index) => {
              if (preset.presetType !== "simulation") return null;
              return (
                <RandomizationPresetLoadSaveControl
                  key={preset.name}
                  index={index}
                  label={preset.name}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  preset={preset}
                />
              );
            })}
          </AccordionControlsItem>
          <AccordionControlsItem
            value="agent-randomization-settings"
            label="Agent Randomization Settings"
            labelHoverTabContentDisplay={[
              "Agent Randomization Settings",
              "Controls the randomization settings for agents.",
            ]}
          >
            <SwitchControlGroup
              label="Enabled Start Types"
              labelHoverTabContentDisplay={[
                "Enabled Start Types",
                "Toggles to enable or disable randomization for various start types. Please note: this is only effective when `Simulation > Agent Settings > Start Type` is set to `Random`.",
              ]}
              switchConfigs={[
                {
                  label: "Center",
                  baseId: "start-type-randomization-center-switch",
                  storePath: [
                    "randomizationSettings",
                    "simulation",
                    "agentStartType",
                    "options",
                    "Center",
                    "enabled",
                  ],
                },
                {
                  label: "Ring",
                  baseId: "start-type-randomization-ring-switch",
                  storePath: [
                    "randomizationSettings",
                    "simulation",
                    "agentStartType",
                    "options",
                    "Ring",
                    "enabled",
                  ],
                },
                {
                  label: "9 Rings",
                  baseId: "start-type-randomization-9-rings-switch",
                  storePath: [
                    "randomizationSettings",
                    "simulation",
                    "agentStartType",
                    "options",
                    "9 Rings",
                    "enabled",
                  ],
                },
                {
                  label: "Circle",
                  baseId: "start-type-randomization-circle-switch",
                  storePath: [
                    "randomizationSettings",
                    "simulation",
                    "agentStartType",
                    "options",
                    "Circle",
                    "enabled",
                  ],
                },
                {
                  label: "Spiral",
                  baseId: "start-type-randomization-spiral-switch",
                  storePath: [
                    "randomizationSettings",
                    "simulation",
                    "agentStartType",
                    "options",
                    "Spiral",
                    "enabled",
                  ],
                },
                {
                  label: "Fill",
                  baseId: "start-type-randomization-fill-switch",
                  storePath: [
                    "randomizationSettings",
                    "simulation",
                    "agentStartType",
                    "options",
                    "Fill",
                    "enabled",
                  ],
                },
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Attraction"
              labelHoverTabContentDisplay={["Clock Attraction"]}
              baseId="clock-attraction-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockAttraction",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Deposit Rate"
              labelHoverTabContentDisplay={["Clock Deposit Rate"]}
              baseId="clock-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockDepositRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Deposit Rate"
              labelHoverTabContentDisplay={["Background Deposit Rate"]}
              baseId="background-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentBackgroundDepositRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Degrees"
              labelHoverTabContentDisplay={["Sensor Degrees"]}
              baseId="sensor-degrees-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorDegrees",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Rotation Rate"
              labelHoverTabContentDisplay={["Rotation Rate"]}
              baseId="rotation-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentRotationRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Offset"
              labelHoverTabContentDisplay={["Sensor Offset"]}
              baseId="sensor-offset-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Width"
              labelHoverTabContentDisplay={["Sensor Width"]}
              baseId="sensor-width-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorWidth",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Step Size"
              labelHoverTabContentDisplay={["Step Size"]}
              baseId="step-size-randomization-control"
              randomizationSettingsStorePath={["simulation", "agentStepSize"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Crowd Avoidance"
              labelHoverTabContentDisplay={["Crowd Avoidance"]}
              baseId="crowd-avoidance-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentCrowdAvoidance",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Wander Strength"
              labelHoverTabContentDisplay={["Wander Strength"]}
              baseId="wander-strength-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentWanderStrength",
              ]}
            />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="trail-randomization-settings"
            label="Trail Randomization Settings"
            labelHoverTabContentDisplay={[
              "Trail Randomization Settings",
              "Controls the randomization settings for trails.",
            ]}
          >
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Decay Rate"
              labelHoverTabContentDisplay={["Clock Decay Rate"]}
              baseId="clock-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDecayRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Diffuse Rate"
              labelHoverTabContentDisplay={["Clock Diffuse Rate"]}
              baseId="clock-diffuse-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDiffuseRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Decay Rate"
              labelHoverTabContentDisplay={["Background Decay Rate"]}
              baseId="background-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailBackgroundDecayRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Diffuse Rate"
              labelHoverTabContentDisplay={["Background Diffuse Rate"]}
              baseId="background-diffuse-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailBackgroundDiffuseRate",
              ]}
            />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="color-randomization-setting-presets"
            label="Color Randomization Presets"
            labelHoverTabContentDisplay={[
              "Color Randomization Presets",
              "Manage and apply presets for color randomization settings.",
            ]}
          >
            <ControlGroup justifyContent="center">
              <SaveRandomizationPresetPopoverButton randomizationPresetType="color" />
            </ControlGroup>
            {randomizationPresets.map((preset, index) => {
              if (preset.presetType !== "color") return null;
              return (
                <RandomizationPresetLoadSaveControl
                  key={preset.name}
                  label={preset.name}
                  index={index}
                  labelHoverTabContentDisplay={[
                    preset.name,
                    <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                      {JSON.stringify(preset, null, 1)}
                    </pre>,
                  ]}
                  preset={preset}
                />
              );
            })}
          </AccordionControlsItem>
          <AccordionControlsItem
            value="color-randomization-settings"
            label="Color Randomization Settings"
            labelHoverTabContentDisplay={[
              "Color Randomization Settings",
              "Controls the randomization settings for colors.",
            ]}
          >
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Y-Offset"
              labelHoverTabContentDisplay={["Red Y-Offset"]}
              baseId="red-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Amplitude"
              labelHoverTabContentDisplay={["Red Amplitude"]}
              baseId="red-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Frequency"
              labelHoverTabContentDisplay={["Red Frequency"]}
              baseId="red-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Phase"
              labelHoverTabContentDisplay={["Red Phase"]}
              baseId="red-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Y-Offset"
              labelHoverTabContentDisplay={["Green Y-Offset"]}
              baseId="green-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Amplitude"
              labelHoverTabContentDisplay={["Green Amplitude"]}
              baseId="green-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Frequency"
              labelHoverTabContentDisplay={["Green Frequency"]}
              baseId="green-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Phase"
              labelHoverTabContentDisplay={["Green Phase"]}
              baseId="green-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Y-Offset"
              labelHoverTabContentDisplay={["Blue Y-Offset"]}
              baseId="blue-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Amplitude"
              labelHoverTabContentDisplay={["Blue Amplitude"]}
              baseId="blue-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Frequency"
              labelHoverTabContentDisplay={["Blue Frequency"]}
              baseId="blue-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Phase"
              labelHoverTabContentDisplay={["Blue Phase"]}
              baseId="blue-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "phase",
              ]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
