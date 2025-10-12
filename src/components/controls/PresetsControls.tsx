import { produce } from "immer";
import { useEffect } from "react";
import {
  CLOCK_CONTROLS_CONFIGS,
  COLOR_CONTROLS_CONFIGS,
  LOADABLE_CLOCK_SETTINGS_KEYS,
  LOADABLE_COLOR_SETTINGS_KEYS,
  LOADABLE_SIMULATION_SETTINGS_KEYS,
  PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
  SIMULATION_CONTROLS_CONFIGS,
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
import ControlGroup from "./ControlGroup.tsx";
import SaveCurrentSettingsAsPresetPopoverButton from "./SaveCurrentSettingsAsPresetPopoverButton.tsx";
import SimulationPresetLoadSaveControl from "./SimulationPresetLoadSaveControl.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentDisplayAreaContentWrapper from "./TabContentDisplayAreaContentWrapper.tsx";
import TabContentScrollArea from "./TabContentScrollArea";

export default function PresetsControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const history = useSlimeStore((state) => state.history);
  const sortedPresets = useSlimeStore((state) => state.sortedSimulationPresets);

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
        state.controlsState.displayAreaContentName = null;
        state.controlsState.hideDisplayAreaBackground = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function getClampedValue(
    value: number,
    min: number,
    max: number,
    step?: number,
  ) {
    if (step) {
      value = Math.round(value / step) * step;
    }
    return Math.min(max, Math.max(min, value));
  }

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
          const newClockSettings: Partial<LoadableClockSettings> = {};
          LOADABLE_CLOCK_SETTINGS_KEYS.forEach((key) => {
            if (key in parsedData.clockSettings) {
              const currentValue = parsedData.clockSettings[key];
              if (
                typeof currentValue !==
                typeof useSlimeStore.getState().clockSettings[key]
              )
                return;
              let newValue = currentValue;
              if (Object.keys(CLOCK_CONTROLS_CONFIGS).includes(key)) {
                const config = CLOCK_CONTROLS_CONFIGS[key];
                newValue = getClampedValue(
                  currentValue as number,
                  config!.min as number,
                  config!.max as number,
                  config!.step as number,
                );
              }
              newClockSettings[key] = newValue;
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
          const newSimulationSettings: Partial<LoadableSimulationSettings> = {};
          LOADABLE_SIMULATION_SETTINGS_KEYS.forEach((key) => {
            if (key in parsedData.simulationSettings) {
              const currentValue = parsedData.simulationSettings[key];
              if (
                typeof currentValue !==
                typeof useSlimeStore.getState().simulationSettings[key]
              )
                return;
              let newValue = currentValue;
              if (Object.keys(SIMULATION_CONTROLS_CONFIGS).includes(key)) {
                const config = SIMULATION_CONTROLS_CONFIGS[key];
                newValue = getClampedValue(
                  currentValue as number,
                  config!.min as number,
                  config!.max as number,
                  config!.step as number,
                );
              } else if (key === "agentDensity") {
                newValue = getClampedValue(currentValue as number, 0, 1, 0.01);
              }
              newSimulationSettings[key] = newValue;
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
          const newColorSettings: Partial<LoadableColorSettings> = {};
          LOADABLE_COLOR_SETTINGS_KEYS.forEach((key) => {
            if (key in parsedData.colorSettings) {
              if (key === "proceduralColorPalette") {
                if (!("proceduralColorPalette" in newColorSettings)) {
                  const currentPalette =
                    useSlimeStore.getState().colorSettings
                      .proceduralColorPalette;
                  newColorSettings.proceduralColorPalette = {
                    r: { ...currentPalette.r },
                    g: { ...currentPalette.g },
                    b: { ...currentPalette.b },
                  };
                }
                ["r", "g", "b"].forEach((channel) => {
                  ["yOffset", "amplitude", "frequency", "phase"].forEach(
                    (param) => {
                      if (
                        param in
                        parsedData.colorSettings.proceduralColorPalette[channel]
                      ) {
                        const currentValue =
                          parsedData.colorSettings.proceduralColorPalette[
                            channel
                          ][param];
                        if (
                          typeof currentValue !==
                          typeof useSlimeStore.getState().colorSettings
                            .proceduralColorPalette[channel as "r" | "g" | "b"][
                            param as
                              | "yOffset"
                              | "amplitude"
                              | "frequency"
                              | "phase"
                          ]
                        )
                          return;
                        let newValue = currentValue;
                        if (
                          Object.keys(
                            PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS,
                          ).includes(param)
                        ) {
                          const config =
                            PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS[
                              param as keyof typeof PROCEDURAL_COLOR_PALETTE_CONTROLS_CONFIGS
                            ];
                          newValue = getClampedValue(
                            currentValue as number,
                            config!.min as number,
                            config!.max as number,
                            config!.step as number,
                          );
                          newColorSettings.proceduralColorPalette![
                            channel as "r" | "g" | "b"
                          ][
                            param as
                              | "yOffset"
                              | "amplitude"
                              | "frequency"
                              | "phase"
                          ] = newValue;
                        }
                      }
                    },
                  );
                });
              } else {
                const currentValue = parsedData.colorSettings[key];
                if (
                  typeof currentValue !==
                  typeof useSlimeStore.getState().colorSettings[key]
                )
                  return;
                let newValue = currentValue;
                if (Object.keys(COLOR_CONTROLS_CONFIGS).includes(key)) {
                  const config = COLOR_CONTROLS_CONFIGS[key];
                  newValue = getClampedValue(
                    currentValue as number,
                    config!.min as number,
                    config!.max as number,
                    config!.step as number,
                  );
                }
                newColorSettings[key] = newValue;
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
                state.toast.title = "Success!";
                state.toast.description =
                  "Loaded color settings from clipboard!";
                state.toast.type = "success";
                state.toast.lastTriggeredAt = Date.now();
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
      // @ts-expect-error This is fine.
      clockSettings: {},
      // @ts-expect-error This is fine.
      simulationSettings: {},
      // @ts-expect-error This is fine.
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
        state.toast.title = "Success!";
        state.toast.description = "Copied current settings to clipboard!";
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
  }

  function getPresetIndex(preset: LoadableSlimeStoreSettings) {
    const presets = useSlimeStore.getState().simulationPresets;
    return presets.findIndex(
      (p) => p.name === preset.name && p.presetType === preset.presetType,
    );
  }

  function setAutoLoadOnRandAll(value: boolean) {
    let simulationPresets = [...useSlimeStore.getState().simulationPresets];
    simulationPresets = simulationPresets.map((preset) => {
      const modifiedPreset = { ...preset };
      if (
        ["Combination", "Simulation Only", "Color Only"].includes(
          preset.presetType,
        )
      ) {
        modifiedPreset.enabled = value;
      }
      return modifiedPreset;
    });
    useSlimeStore.setState(
      produce((state) => {
        state.simulationPresets = simulationPresets;
        state.toast.title = "Load on Auto Rand. Updated";
        state.toast.description = `All "simulation", "color", and "combination" presets have been ${value ? "enabled" : "disabled"} for load on auto-randomization.`;
        state.toast.type = "info";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
  }

  return (
    <TabContentContainer tabsValue="presets-controls">
      <TabContentScrollArea title="Presets">
        <AccordionControlsWrapper
          accordionId="presets-controls-accordion"
          type="multiple"
          defaultValue={["import-export", "presets", "history"]}
        >
          <AccordionControlsItem
            value="import-export"
            label="Import / Export"
            labelHoverTabContentDisplay={[
              "Import / Export",
              "Load and save presets to and from your clipboard. Highly experimental. Try to avoid setting extreme values that could crash your browser.",
            ]}
          >
            <ButtonControlGroup
              labelHoverTabContentDisplay={[
                "Import / Export",
                "Load and save presets to and from your clipboard. Highly experimental. Try to avoid setting extreme values that could crash your browser.",
              ]}
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
            labelHoverTabContentDisplay={[
              "Presets",
              "Load and save presets for clock, simulation, and color settings. Default presets cannot be deleted.",
            ]}
          >
            <ControlGroup
              labelHoverTabContentDisplay={[
                "Save Current Settings As Preset",
                "Save your current settings as a new preset. Clicking this button will open a dialog to enter the preset name prior to saving. All preset names within a given category (simulation, color, clock, combination) must be unique. You can manage and apply your saved presets below. Default presets cannot be overwritten or deleted.",
              ]}
              justifyContent="center"
            >
              <SaveCurrentSettingsAsPresetPopoverButton presetType="Combination" />
            </ControlGroup>
            <ButtonControlGroup
              labelHoverTabContentDisplay={[
                "Load on Auto Rand. - All Presets",
                <TabContentDisplayAreaContentWrapper>
                  Enables or disables all simulation, color, and combination
                  presets for load on auto randomization. When the simulation or
                  color auto-randomization mode is set to{" "}
                  <em>Use Random Enabled Simulation/Color Preset</em>, the
                  relevant enabled presets will be randomly loaded when the
                  auto-randomization occurs.
                </TabContentDisplayAreaContentWrapper>,
              ]}
              justifyContent="center"
              buttonConfigs={[
                {
                  label: "Enable Load on Auto Rand - All",
                  baseId:
                    "presets-controls-presets-enable-load-on-auto-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(true),
                },
                {
                  label: "Disable Load on Auto Rand - All",
                  baseId:
                    "presets-controls-presets-disable-load-on-auto-rand-all-button",
                  onClick: () => setAutoLoadOnRandAll(false),
                },
              ]}
            />
            {sortedPresets["Clock Only"]?.map((preset) => (
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
            {sortedPresets["Simulation Only"]?.map((preset) => (
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
            {sortedPresets["Color Only"]?.map((preset) => (
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
            {sortedPresets["Combination"]?.map((preset) => (
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
            value="history"
            label="History"
            labelHoverTabContentDisplay={[
              "History",
              "Recent changes to settings are saved to history. You can load, save, or copy to your clipboard any of these recent settings. History persists between sessions.",
            ]}
          >
            {history.map((entry) => (
              <SimulationPresetLoadSaveControl
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
                index={getPresetIndex(entry)}
              />
            ))}
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
