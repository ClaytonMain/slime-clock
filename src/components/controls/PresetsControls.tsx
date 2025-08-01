import { produce } from "immer";
import * as R from "ramda";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { SimulationSettings } from "../../types/types.tsx";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function PresetsControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  function saveSimulationSettingsAsPreset() {
    const storePaths: ["simulationSettings", keyof SimulationSettings][] = [
      ["simulationSettings", "speed"],
      ["simulationSettings", "boundaryBehavior"],
      ["simulationSettings", "agentStartType"],
      ["simulationSettings", "agentClockAttraction"],
      ["simulationSettings", "agentClockDepositRate"],
      ["simulationSettings", "agentBackgroundDepositRate"],
      ["simulationSettings", "agentSensorDegrees"],
      ["simulationSettings", "agentRotationRate"],
      ["simulationSettings", "agentSensorOffset"],
      ["simulationSettings", "agentSensorWidth"],
      ["simulationSettings", "agentStepSize"],
      ["simulationSettings", "agentCrowdAvoidance"],
      ["simulationSettings", "agentWanderStrength"],
      ["simulationSettings", "trailClockDecayRate"],
      ["simulationSettings", "trailClockDiffuseRate"],
      ["simulationSettings", "trailBackgroundDecayRate"],
      ["simulationSettings", "trailBackgroundDiffuseRate"],
    ];

    const simulationSettings = useSlimeStore.getState().simulationSettings;

    const preset: Partial<SimulationSettings> = {};
    storePaths.forEach(([path, key]) => {
      preset[key] = R.view(R.lensPath(path), simulationSettings);
    });
    console.log(preset);
    useSlimeStore.setState(
      produce((state) => {
        const presetName = `preset-${Date.now()}`;
        state.presets[presetName] = preset;
      }),
    );
  }

  const presetsControlsLabelHoverTabContentDisplay = [
    "Presets Controls",
    "Controls related to presets.",
  ];

  useEffect(() => {
    if (selectedTab !== "presets-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          presetsControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  return (
    <TabContentContainer tabsValue="presets-controls">
      <TabContentScrollArea title="Presets">
        <AccordionControlsWrapper
          type="multiple"
          defaultValue={["quick-settings"]}
        >
          <AccordionControlsItem
            value="quick-settings"
            label="Quick Settings"
            labelHoverTabContentDisplay={[
              "Quick Settings",
              <div className="px-2 py-1">
                <ul className="list-inside list-disc">
                  <li>Gleep glorp</li>
                </ul>
              </div>,
            ]}
          >
            <ButtonControlGroup
              label="Quick Actions"
              labelHoverTabContentDisplay={["Quick Actions"]}
              buttonConfigs={[
                {
                  label: "Save All as Preset",
                  baseId: "save-all-as-preset-button",
                  onClick: () => {
                    // Implement save preset logic here
                  },
                },
                {
                  label: "Save Sim. Settings as Preset",
                  baseId: "save-simulation-settings-as-preset-button",
                  onClick: saveSimulationSettingsAsPreset,
                },
                {
                  label: "Save Color Settings as Preset",
                  baseId: "save-color-settings-as-preset-button",
                  onClick: () => {
                    // Implement save preset logic here
                  },
                },
              ]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
