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
        state.controlsState.displayAreaContentName = null;
        state.controlsState.hideDisplayAreaBackground = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function updateNeededRandomizations(settings: string[]) {
    const randomizationSettings =
      useSlimeStore.getState().randomizationSettings;
    const randomized: string[] = [];
    const notRandomized: string[] = [];
    useSlimeStore.setState(
      produce((state) => {
        settings.forEach((setting) => {
          switch (setting) {
            case "agents":
              state.randomizationState.agentRandomizationRequestedAt =
                Date.now();
              if (randomizationSettings.allowAgentRandomization) {
                randomized.push("agents");
              } else {
                notRandomized.push("agents");
              }
              break;
            case "trail":
              state.randomizationState.trailRandomizationRequestedAt =
                Date.now();
              if (randomizationSettings.allowTrailRandomization) {
                randomized.push("trail");
              } else {
                notRandomized.push("trail");
              }
              break;
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

  function setAutoLoadOnRandAll(
    value: boolean,
    presetType: "simulation" | "color",
  ) {
    let simulationPresets = [...useSlimeStore.getState().randomizationPresets];
    simulationPresets = simulationPresets.map((preset) => {
      const modifiedPreset = { ...preset };
      if (preset.presetType === presetType) {
        modifiedPreset.enabled = value;
      }
      return modifiedPreset;
    });
    useSlimeStore.setState(
      produce((state) => {
        state.randomizationPresets = simulationPresets;
        state.toast.title = "Auto Load on Rand. Updated";
        state.toast.description = `All ${presetType} randomization presets have been ${value ? "enabled" : "disabled"} for auto load on randomization.`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
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
              label="Sim. Auto Rand. Enabled"
              labelHoverTabContentDisplay={[
                "Simulation Auto Randomization Enabled",
                'Allows the simulation to randomize certain parameters at set intervals. The randomization interval is set using the \'Randomization Interval\' slider. Control over which parameters are randomized can be found in the "Agent Randomization Settings" and "Trail Randomization Settings" accordions below. Auto randomization is disabled when the controls are open.',
              ]}
              baseId="auto-randomization-enabled-switch"
              storePath={[
                "randomizationSettings",
                "simulationAutoRandomizationEnabled",
              ]}
            />
            <SlimeStoreSliderControl
              label="Sim. Auto Rand. Interval"
              labelHoverTabContentDisplay={[]}
              baseInputId="auto-randomization-interval-slider"
              min={1}
              max={60}
              step={1}
              storePath={[
                "randomizationSettings",
                "simulationAutoRandomizationInterval",
              ]}
            />
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
                  label: "Restart Simulation",
                  baseId: "restart-simulation-button",
                  onClick: () => {
                    useSlimeStore.setState(
                      produce((state) => {
                        state.randomizationState.simulationRestartRequestedAt =
                          Date.now();
                        state.toast.title = "Simulation Restarted";
                        state.toast.description =
                          "The simulation has been restarted.";
                        state.toast.type = "info";
                        state.toast.lastTriggeredAt = Date.now();
                      }),
                    );
                  },
                },
                {
                  label: "Randomize All",
                  baseId: "randomize-all-button",
                  onClick: () => {
                    updateNeededRandomizations(["agents", "trail", "color"]);
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
                  label: "Randomize Color Settings",
                  baseId: "randomize-color-settings-button",
                  onClick: () => {
                    updateNeededRandomizations(["color"]);
                  },
                },
              ]}
            />
            <ControlGroup label="Quick Save">
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
            <ButtonControlGroup
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Auto Load on Rand - All Sim.",
                  baseId: "enable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(true, "simulation"),
                },
                {
                  label: "Disable Auto Load on Rand - All Sim.",
                  baseId: "disable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(false, "simulation"),
                },
              ]}
            />
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
                "Toggles to enable or disable randomization for various start types. Note: if all start types are disabled, then a random start type will be chosen.",
              ]}
              switchConfigs={[
                {
                  label: "Center",
                  baseId: "start-type-randomization-center-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
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
                    "agentStartTypeRandomizationOptions",
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
                    "agentStartTypeRandomizationOptions",
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
                    "agentStartTypeRandomizationOptions",
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
                    "agentStartTypeRandomizationOptions",
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
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Fill",
                    "enabled",
                  ],
                },
                {
                  label: "Hexagonal Grid",
                  baseId: "start-type-randomization-hexagonal-grid-switch",
                  storePath: [
                    "randomizationSettings",
                    "agentStartTypeRandomizationOptions",
                    "options",
                    "Hexagonal Grid",
                    "enabled",
                  ],
                },
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Attraction"
              baseId="clock-attraction-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockAttraction",
              ]}
              settingStorePath={["simulationSettings", "agentClockAttraction"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Deposit Rate"
              baseId="clock-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockDepositRate",
              ]}
              settingStorePath={["simulationSettings", "agentClockDepositRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Deposit Rate"
              baseId="background-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentBackgroundDepositRate",
              ]}
              settingStorePath={[
                "simulationSettings",
                "agentBackgroundDepositRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Degrees"
              baseId="sensor-degrees-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorDegrees",
              ]}
              settingStorePath={["simulationSettings", "agentSensorDegrees"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Rotation Rate"
              baseId="rotation-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentRotationRate",
              ]}
              settingStorePath={["simulationSettings", "agentRotationRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Offset"
              baseId="sensor-offset-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorOffset",
              ]}
              settingStorePath={["simulationSettings", "agentSensorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Sensor Width"
              baseId="sensor-width-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorWidth",
              ]}
              settingStorePath={["simulationSettings", "agentSensorWidth"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Step Size"
              baseId="step-size-randomization-control"
              randomizationSettingsStorePath={["simulation", "agentStepSize"]}
              settingStorePath={["simulationSettings", "agentStepSize"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Crowd Avoidance"
              baseId="crowd-avoidance-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentCrowdAvoidance",
              ]}
              settingStorePath={["simulationSettings", "agentCrowdAvoidance"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Wander Strength"
              baseId="wander-strength-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentWanderStrength",
              ]}
              settingStorePath={["simulationSettings", "agentWanderStrength"]}
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
            <SlimeStoreSwitchControl
              label="Allow Boundary Behavior Rand."
              baseId="allow-boundary-behavior-randomization-switch"
              storePath={[
                "randomizationSettings",
                "allowBoundaryBehaviorRandomization",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Decay Rate"
              baseId="clock-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDecayRate",
              ]}
              settingStorePath={["simulationSettings", "trailClockDecayRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Diffuse Rate"
              baseId="clock-diffuse-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDiffuseRate",
              ]}
              settingStorePath={["simulationSettings", "trailClockDiffuseRate"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Decay Rate"
              baseId="background-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailBackgroundDecayRate",
              ]}
              settingStorePath={[
                "simulationSettings",
                "trailBackgroundDecayRate",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Background Diffuse Rate"
              baseId="background-diffuse-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailBackgroundDiffuseRate",
              ]}
              settingStorePath={[
                "simulationSettings",
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
            <ButtonControlGroup
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Auto Load on Rand - All Colors",
                  baseId: "enable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(true, "color"),
                },
                {
                  label: "Disable Auto Load on Rand - All Colors",
                  baseId: "disable-auto-load-on-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(false, "color"),
                },
              ]}
            />
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
            <SlimeStoreSwitchControl
              label="Enable Bg Color Rand."
              baseId="randomization-controls-background-color-enabled-switch"
              storePath={[
                "randomizationSettings",
                "color",
                "backgroundColor",
                "enabled",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Y-Offset"
              baseId="red-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "yOffset",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Amplitude"
              baseId="red-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "amplitude",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Frequency"
              baseId="red-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "frequency",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Red Phase"
              baseId="red-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "r",
                "phase",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "r",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Y-Offset"
              baseId="green-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "yOffset",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Amplitude"
              baseId="green-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "amplitude",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Frequency"
              baseId="green-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "frequency",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Green Phase"
              baseId="green-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "g",
                "phase",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "g",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Y-Offset"
              baseId="blue-y-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "yOffset",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "yOffset",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Amplitude"
              baseId="blue-amplitude-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "amplitude",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "amplitude",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Frequency"
              baseId="blue-frequency-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "frequency",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "frequency",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Blue Phase"
              baseId="blue-phase-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "proceduralColorPalette",
                "b",
                "phase",
              ]}
              settingStorePath={[
                "colorSettings",
                "proceduralColorPalette",
                "b",
                "phase",
              ]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Intensity Smoothing"
              baseId="randomization-controls-intensity-smoothing-randomization-control"
              randomizationSettingsStorePath={["color", "intensitySmoothing"]}
              settingStorePath={["colorSettings", "intensitySmoothing"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Agent Dir. Smoothing"
              baseId="randomization-controls-agent-direction-smoothing-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "agentDirectionSmoothing",
              ]}
              settingStorePath={["colorSettings", "agentDirectionSmoothing"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Agent Dir. Color Offset"
              baseId="randomization-controls-agent-direction-color-offset-randomization-control"
              randomizationSettingsStorePath={[
                "color",
                "agentDirectionColorOffset",
              ]}
              settingStorePath={["colorSettings", "agentDirectionColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Clock Color Offset"
              baseId="randomization-controls-clock-color-offset-randomization-control"
              randomizationSettingsStorePath={["color", "clockColorOffset"]}
              settingStorePath={["colorSettings", "clockColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="X Color Offset"
              baseId="randomization-controls-x-color-offset-randomization-control"
              randomizationSettingsStorePath={["color", "xColorOffset"]}
              settingStorePath={["colorSettings", "xColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Y Color Offset"
              baseId="randomization-controls-y-color-offset-randomization-control"
              randomizationSettingsStorePath={["color", "yColorOffset"]}
              settingStorePath={["colorSettings", "yColorOffset"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Palette Cycle Speed"
              baseId="randomization-controls-palette-cycle-speed-randomization-control"
              randomizationSettingsStorePath={["color", "paletteCycleSpeed"]}
              settingStorePath={["colorSettings", "paletteCycleSpeed"]}
            />
            <SlimeStoreNumericRangeRandomizationControl
              label="Palette Cycle Scale"
              baseId="randomization-controls-palette-cycle-scale-randomization-control"
              randomizationSettingsStorePath={["color", "paletteCycleScale"]}
              settingStorePath={["colorSettings", "paletteCycleScale"]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
