import { produce } from "immer";
import { useEffect, useState } from "react";
import {
  LOADABLE_CLOCK_SETTINGS_KEYS,
  LOADABLE_COLOR_SETTINGS_KEYS,
  LOADABLE_SIMULATION_SETTINGS_KEYS,
} from "../../constants/constants.tsx";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  LoadableClockSettings,
  LoadableColorSettings,
  LoadableSimulationSettings,
  LoadableSlimeStoreSettings,
  PresetType,
} from "../../types/types.tsx";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup.tsx";
import SettingsLoadSaveControl from "./SettingsLoadSaveControl.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

function presetSortFunction(
  a: LoadableSlimeStoreSettings,
  b: LoadableSlimeStoreSettings,
) {
  const presetTypeOrder: Record<PresetType, number> = {
    "Clock Only": 1,
    "Simulation Only": 2,
    "Color Only": 3,
    Combination: 4,
  };
  const typeOrderA = presetTypeOrder[a.presetType];
  const typeOrderB = presetTypeOrder[b.presetType];
  if (typeOrderA !== typeOrderB) {
    return typeOrderA - typeOrderB;
  }
  return a.name.localeCompare(b.name);
}

export default function PresetsControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const history = useSlimeStore((state) => state.history);
  const presets = useSlimeStore((state) => state.presets);
  const [sortedPresets, setSortedPresets] =
    useState<LoadableSlimeStoreSettings[]>(presets);

  useEffect(() => {
    const sorted = [...presets].sort(presetSortFunction);
    setSortedPresets(sorted);
  }, [presets]);

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

  function handleLoadFromClipboard() {
    const clipboardData = navigator.clipboard.readText();
    clipboardData
      .then((data) => {
        const parsedData = JSON.parse(data);

        if (!parsedData || typeof parsedData !== "object") {
          // TODO: Alert the user.
          console.error("Invalid data format from clipboard");
          return;
        }
        const expectedKeys = [
          "clockSettings",
          "simulationSettings",
          "colorSettings",
        ];
        if (!expectedKeys.some((key) => key in parsedData)) {
          // TODO: Alert the user.
          console.error("Missing expected keys in clipboard data");
          return;
        }
        if ("clockSettings" in parsedData) {
          // TODO: Add control bounding logic.
          const newClockSettings: Partial<LoadableClockSettings> = {};
          LOADABLE_CLOCK_SETTINGS_KEYS.forEach((key) => {
            if (key in parsedData.clockSettings) {
              const currentValue = parsedData.clockSettings[key];
              if (
                typeof currentValue ===
                typeof useSlimeStore.getState().clockSettings[key]
              ) {
                newClockSettings[key] = currentValue;
              }
            }
          });
          if (Object.keys(newClockSettings).length > 0) {
            useSlimeStore.setState(
              produce((state) => {
                state.clockSettings = {
                  ...state.clockSettings,
                  ...newClockSettings,
                };
              }),
            );
          }
        }
        if ("simulationSettings" in parsedData) {
          // TODO: Add control bounding logic.
          const newSimulationSettings: Partial<LoadableSimulationSettings> = {};
          LOADABLE_SIMULATION_SETTINGS_KEYS.forEach((key) => {
            if (key in parsedData.simulationSettings) {
              const currentValue = parsedData.simulationSettings[key];
              if (
                typeof currentValue ===
                typeof useSlimeStore.getState().simulationSettings[key]
              ) {
                newSimulationSettings[key] = currentValue;
              }
            }
          });
          if (Object.keys(newSimulationSettings).length > 0) {
            useSlimeStore.setState(
              produce((state) => {
                state.simulationSettings = {
                  ...state.simulationSettings,
                  ...newSimulationSettings,
                };
              }),
            );
          }
        }
        if ("colorSettings" in parsedData) {
          // TODO: Add control bounding logic.
          const newColorSettings: Partial<LoadableColorSettings> = {};
          LOADABLE_COLOR_SETTINGS_KEYS.forEach((key) => {
            if (key in parsedData.colorSettings) {
              const currentValue = parsedData.colorSettings[key];
              if (
                typeof currentValue ===
                typeof useSlimeStore.getState().colorSettings[key]
              ) {
                newColorSettings[key] = currentValue;
              }
            }
          });
          if (Object.keys(newColorSettings).length > 0) {
            useSlimeStore.setState(
              produce((state) => {
                state.colorSettings = {
                  ...state.colorSettings,
                  ...newColorSettings,
                  slimeColorChangedAt: Date.now(),
                };
              }),
            );
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load from clipboard:", error);
      });
  }

  return (
    <TabContentContainer tabsValue="presets-controls">
      <TabContentScrollArea title="Presets">
        <AccordionControlsWrapper
          type="multiple"
          defaultValue={["import-export", "presets", "history"]}
        >
          <AccordionControlsItem
            value="import-export"
            label="Import / Export"
            labelHoverTabContentDisplay={[]}
          >
            <ButtonControlGroup
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Load From Clipboard",
                  baseId: "load-from-clipboard",
                  onClick: handleLoadFromClipboard,
                },
              ]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="presets"
            label="Presets"
            labelHoverTabContentDisplay={[]}
          >
            {sortedPresets.map((preset) => (
              <SettingsLoadSaveControl
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
              />
            ))}
          </AccordionControlsItem>

          <AccordionControlsItem
            value="history"
            label="History"
            labelHoverTabContentDisplay={[]}
          >
            {history.map((entry) => (
              <SettingsLoadSaveControl
                key={entry.name}
                label={entry.name}
                labelHoverTabContentDisplay={[
                  entry.name,
                  <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                    {JSON.stringify(entry, null, 1)}
                  </pre>,
                ]}
                settings={entry}
                controlType="history"
              />
            ))}
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
