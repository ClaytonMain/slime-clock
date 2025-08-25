import { produce } from "immer";
import { useEffect } from "react";
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
} from "../../types/types.tsx";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup.tsx";
import {
  default as SettingsLoadSaveControl,
  default as SettingsPresetLoadSaveControl,
} from "./SettingsPresetLoadSaveControl.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function PresetsControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const history = useSlimeStore((state) => state.history);
  const sortedPresets = useSlimeStore((state) => state.sortedPresets);

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
          useSlimeStore.setState(
            produce((state) => {
              state.toast.title = "Error";
              state.toast.description =
                "Invalid data format! Double-check your clipboard data.";
              state.toast.type = "error";
              state.toast.lastTriggeredAt = Date.now();
            }),
          );
          return;
        }
        const expectedKeys = [
          "clockSettings",
          "simulationSettings",
          "colorSettings",
        ];
        if (!expectedKeys.some((key) => key in parsedData)) {
          useSlimeStore.setState(
            produce((state) => {
              state.toast.title = "Error";
              state.toast.description =
                "No expected settings found! Double-check your clipboard data.";
              state.toast.type = "error";
              state.toast.lastTriggeredAt = Date.now();
            }),
          );
          return;
        }
        if ("clockSettings" in parsedData) {
          // TODO: Add control validation logic.
          const newClockSettings: Partial<LoadableClockSettings> = {};
          LOADABLE_CLOCK_SETTINGS_KEYS.forEach((key) => {
            if (key in parsedData.clockSettings) {
              const currentValue = parsedData.clockSettings[key];
              if (
                typeof currentValue !==
                typeof useSlimeStore.getState().clockSettings[key]
              ) {
                return;
              }
              newClockSettings[key] = currentValue;
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
          // TODO: Add control validation logic.
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
          // TODO: Add control validation logic.
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
                state.toast = {
                  title: "Success!",
                  description: "Loaded color settings from clipboard!",
                  type: "success",
                  lastTriggeredAt: Date.now(),
                };
              }),
            );
          }
        }
      })
      .catch((e) => {
        if (e instanceof SyntaxError) {
          useSlimeStore.setState(
            produce((state) => {
              state.toast.title = "Error";
              state.toast.description =
                "Invalid syntax! Double-check your clipboard data, then try again.";
              state.toast.type = "error";
              state.toast.lastTriggeredAt = Date.now();
            }),
          );
        } else {
          useSlimeStore.setState(
            produce((state) => {
              state.toast.title = "Error";
              state.toast.description =
                "Unknown error! Double-check your clipboard data and try again.";
              state.toast.type = "error";
              state.toast.lastTriggeredAt = Date.now();
            }),
          );
        }
        console.error("Failed to load from clipboard:", e);
      });
  }

  function handleCopyCurrentToClipboard() {
    const currentState = useSlimeStore.getState();
    const currentLoadableSettings: Partial<LoadableSlimeStoreSettings> = {
      // @ts-expect-error Don't look at me.
      clockSettings: {},
      // @ts-expect-error Ignore me.
      simulationSettings: {},
      // @ts-expect-error Shhhhhhhhhhh.
      colorSettings: {},
    };
    LOADABLE_CLOCK_SETTINGS_KEYS.forEach((key) => {
      const typedKey = key as keyof LoadableClockSettings;
      // @ts-expect-error This is fine.
      currentLoadableSettings.clockSettings[typedKey] =
        currentState.clockSettings[typedKey];
    });
    LOADABLE_SIMULATION_SETTINGS_KEYS.forEach((key) => {
      const typedKey = key as keyof LoadableSimulationSettings;
      // @ts-expect-error This if also fine.
      currentLoadableSettings.simulationSettings[typedKey] =
        currentState.simulationSettings[typedKey];
    });
    LOADABLE_COLOR_SETTINGS_KEYS.forEach((key) => {
      const typedKey = key as keyof LoadableColorSettings;
      // @ts-expect-error Hey, guess what this is.
      currentLoadableSettings.colorSettings[typedKey] =
        currentState.colorSettings[typedKey];
    });
    navigator.clipboard.writeText(
      JSON.stringify(currentLoadableSettings, null, 2),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.toast = {
          title: "Success!",
          description: "Copied current settings to clipboard!",
          type: "success",
          lastTriggeredAt: Date.now(),
        };
      }),
    );
  }

  return (
    <TabContentContainer tabsValue="presets-controls">
      <TabContentScrollArea title="Presets">
        <AccordionControlsWrapper
          accordionId="presets-controls-accordion"
          type="multiple"
          defaultValue={[
            "import-export",
            "presets",
            "presets-clock-only",
            "presets-simulation-only",
            "presets-color-only",
            "presets-combination",
            "history",
          ]}
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
                {
                  label: "Copy Current to Clipboard",
                  baseId: "copy-current-to-clipboard",
                  onClick: handleCopyCurrentToClipboard,
                },
              ]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="presets"
            label="Presets"
            labelHoverTabContentDisplay={[]}
          >
            {sortedPresets["Clock Only"] && (
              <AccordionControlsItem
                value="presets-clock-only"
                label="Clock Only"
              >
                {sortedPresets["Clock Only"].map((preset) => (
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
            )}
            {sortedPresets["Simulation Only"] && (
              <AccordionControlsItem
                value="presets-simulation-only"
                label="Simulation Only"
              >
                {sortedPresets["Simulation Only"].map((preset) => (
                  <SettingsPresetLoadSaveControl
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
            )}
            {sortedPresets["Color Only"] && (
              <AccordionControlsItem
                value="presets-color-only"
                label="Color Only"
              >
                {sortedPresets["Color Only"].map((preset) => (
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
            )}
            {sortedPresets["Combination"] && (
              <AccordionControlsItem
                value="presets-combination"
                label="Combination"
              >
                {sortedPresets["Combination"].map((preset) => (
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
            )}
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
