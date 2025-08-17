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
                  baseId: "agents-randomization-switch",
                  storePath: [
                    "randomizationSettings",
                    "allowAgentsRandomization",
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
              controlName={"agentClockAttraction"}
            />
            <SlimeStoreRandomizationControl
              label="Clock Deposit Rate"
              labelHoverTabContentDisplay={["Clock Deposit Rate"]}
              baseId="clock-deposit-rate-randomization-control"
              controlName={"agentClockDepositRate"}
            />
            <SlimeStoreRandomizationControl
              label="Background Deposit Rate"
              labelHoverTabContentDisplay={["Background Deposit Rate"]}
              baseId="background-deposit-rate-randomization-control"
              controlName={"agentBackgroundDepositRate"}
            />
            <SlimeStoreRandomizationControl
              label="Sensor Degrees"
              labelHoverTabContentDisplay={["Sensor Degrees"]}
              baseId="sensor-degrees-randomization-control"
              controlName={"agentSensorDegrees"}
            />
            <SlimeStoreRandomizationControl
              label="Rotation Rate"
              labelHoverTabContentDisplay={["Rotation Rate"]}
              baseId="rotation-rate-randomization-control"
              controlName={"agentRotationRate"}
            />
            <SlimeStoreRandomizationControl
              label="Sensor Offset"
              labelHoverTabContentDisplay={["Sensor Offset"]}
              baseId="sensor-offset-randomization-control"
              controlName={"agentSensorOffset"}
            />
            <SlimeStoreRandomizationControl
              label="Sensor Width"
              labelHoverTabContentDisplay={["Sensor Width"]}
              baseId="sensor-width-randomization-control"
              controlName={"agentSensorWidth"}
            />
            <SlimeStoreRandomizationControl
              label="Step Size"
              labelHoverTabContentDisplay={["Step Size"]}
              baseId="step-size-randomization-control"
              controlName={"agentStepSize"}
            />
            <SlimeStoreRandomizationControl
              label="Crowd Avoidance"
              labelHoverTabContentDisplay={["Crowd Avoidance"]}
              baseId="crowd-avoidance-randomization-control"
              controlName={"agentCrowdAvoidance"}
            />
            <SlimeStoreRandomizationControl
              label="Wander Strength"
              labelHoverTabContentDisplay={["Wander Strength"]}
              baseId="wander-strength-randomization-control"
              controlName={"agentWanderStrength"}
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
              controlName={"trailClockDecayRate"}
            />
            <SlimeStoreRandomizationControl
              label="Clock Diffuse Rate"
              labelHoverTabContentDisplay={["Clock Diffuse Rate"]}
              baseId="clock-diffuse-rate-randomization-control"
              controlName={"trailClockDiffuseRate"}
            />
            <SlimeStoreRandomizationControl
              label="Background Decay Rate"
              labelHoverTabContentDisplay={["Background Decay Rate"]}
              baseId="background-decay-rate-randomization-control"
              controlName={"trailBackgroundDecayRate"}
            />
            <SlimeStoreRandomizationControl
              label="Background Diffuse Rate"
              labelHoverTabContentDisplay={["Background Diffuse Rate"]}
              baseId="background-diffuse-rate-randomization-control"
              controlName={"trailBackgroundDiffuseRate"}
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
              label="Clock Decay Rate"
              labelHoverTabContentDisplay={["Clock Decay Rate"]}
              baseId="clock-decay-rate-randomization-control"
              controlName={"trailClockDecayRate"}
            />
            <SlimeStoreRandomizationControl
              label="Clock Diffuse Rate"
              labelHoverTabContentDisplay={["Clock Diffuse Rate"]}
              baseId="clock-diffuse-rate-randomization-control"
              controlName={"trailClockDiffuseRate"}
            />
            <SlimeStoreRandomizationControl
              label="Background Decay Rate"
              labelHoverTabContentDisplay={["Background Decay Rate"]}
              baseId="background-decay-rate-randomization-control"
              controlName={"trailBackgroundDecayRate"}
            />
            <SlimeStoreRandomizationControl
              label="Background Diffuse Rate"
              labelHoverTabContentDisplay={["Background Diffuse Rate"]}
              baseId="background-diffuse-rate-randomization-control"
              controlName={"trailBackgroundDiffuseRate"}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
