import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup";
import SlimeStoreRandomizationControl from "./SlimeStoreRandomizationControl";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import SwitchControlGroup from "./SwitchControlGroup";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function RandomizationControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

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
          </AccordionControlsItem>
          <AccordionControlsItem
            value="agent-randomization-settings"
            label="Agent Randomization Settings"
            labelHoverTabContentDisplay={[
              "Agent Randomization Settings",
              "Controls the randomization settings for agents.",
            ]}
          >
            <SlimeStoreRandomizationControl
              label="Clock Attraction"
              labelHoverTabContentDisplay={["Clock Attraction"]}
              baseId="clock-attraction-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockAttraction",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Clock Deposit Rate"
              labelHoverTabContentDisplay={["Clock Deposit Rate"]}
              baseId="clock-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentClockDepositRate",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Background Deposit Rate"
              labelHoverTabContentDisplay={["Background Deposit Rate"]}
              baseId="background-deposit-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentBackgroundDepositRate",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Sensor Degrees"
              labelHoverTabContentDisplay={["Sensor Degrees"]}
              baseId="sensor-degrees-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorDegrees",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Rotation Rate"
              labelHoverTabContentDisplay={["Rotation Rate"]}
              baseId="rotation-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentRotationRate",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Sensor Offset"
              labelHoverTabContentDisplay={["Sensor Offset"]}
              baseId="sensor-offset-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorOffset",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Sensor Width"
              labelHoverTabContentDisplay={["Sensor Width"]}
              baseId="sensor-width-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentSensorWidth",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Step Size"
              labelHoverTabContentDisplay={["Step Size"]}
              baseId="step-size-randomization-control"
              randomizationSettingsStorePath={["simulation", "agentStepSize"]}
            />
            <SlimeStoreRandomizationControl
              label="Crowd Avoidance"
              labelHoverTabContentDisplay={["Crowd Avoidance"]}
              baseId="crowd-avoidance-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "agentCrowdAvoidance",
              ]}
            />
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
              label="Clock Decay Rate"
              labelHoverTabContentDisplay={["Clock Decay Rate"]}
              baseId="clock-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDecayRate",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Clock Diffuse Rate"
              labelHoverTabContentDisplay={["Clock Diffuse Rate"]}
              baseId="clock-diffuse-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailClockDiffuseRate",
              ]}
            />
            <SlimeStoreRandomizationControl
              label="Background Decay Rate"
              labelHoverTabContentDisplay={["Background Decay Rate"]}
              baseId="background-decay-rate-randomization-control"
              randomizationSettingsStorePath={[
                "simulation",
                "trailBackgroundDecayRate",
              ]}
            />
            <SlimeStoreRandomizationControl
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
            value="color-randomization-settings"
            label="Color Randomization Settings"
            labelHoverTabContentDisplay={[
              "Color Randomization Settings",
              "Controls the randomization settings for colors.",
            ]}
          >
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
            <SlimeStoreRandomizationControl
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
