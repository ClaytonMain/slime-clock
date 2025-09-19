import { produce } from "immer";
import { useEffect } from "react";
import { CLOCK_CONTROLS_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  ClockDigitStyleValue,
  ClockHourFormatValue,
  LoadableSlimeStoreSettings,
} from "../../types/types";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ControlGroup from "./ControlGroup";
import SaveCurrentSettingsAsPresetPopoverButton from "./SaveCurrentSettingsAsPresetPopoverButton";
import SimulationPresetLoadSaveControl from "./SimulationPresetLoadSaveControl";
import SlimeStoreColorPickerControl from "./SlimeStoreColorPickerControl";
import SlimeStoreSelectControl from "./SlimeStoreSelectControl";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

type ClockDigitLayoutOption = {
  value: "horizontal" | "vertical";
  label: string;
};
const clockDigitLayoutOptions: ClockDigitLayoutOption[] = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
] as const;

/**
 * Clock Digit Style
 * 7 Segment, Dot Matrix
 */
type ClockDigitStyleOption = {
  value: ClockDigitStyleValue;
  label: string;
};
const clockStyleOptions: ClockDigitStyleOption[] = [
  { value: "7segment", label: "7 Segment" },
  { value: "14segment", label: "14 Segment" },
  { value: "dotmatrix", label: "Dot Matrix" },
  { value: "syne", label: "Syne Mono" },
  { value: "roboto", label: "Roboto Mono" },
] as const;

/**
 * Clock Hour Format
 * 12 Hour, 24 Hour
 */
type ClockHourFormatOption = {
  value: ClockHourFormatValue;
  label: string;
};
const clockFormatOptions: ClockHourFormatOption[] = [
  { value: "12h", label: "12 Hour" },
  { value: "24h", label: "24 Hour" },
] as const;

export default function ClockControls() {
  const sortedSimulationPresets = useSlimeStore(
    (state) => state.sortedSimulationPresets,
  );
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  const clockControlsLabelHoverTabContentDisplay = [
    "Clock Controls",
    "Controls related to the clock display.",
  ];

  useEffect(() => {
    if (selectedTab !== "clock-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          clockControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentName = null;
        state.controlsState.hideDisplayAreaBackground = false;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function getPresetIndex(preset: LoadableSlimeStoreSettings) {
    const presets = useSlimeStore.getState().simulationPresets;
    return presets.findIndex(
      (p) => p.name === preset.name && p.presetType === preset.presetType,
    );
  }

  return (
    <TabContentContainer tabsValue="clock-controls">
      <TabContentScrollArea title="Clock">
        <AccordionControlsWrapper
          accordionId="clock-controls-accordion"
          type="multiple"
          defaultValue={["clock-settings", "clock-controls-presets"]}
        >
          <AccordionControlsItem
            value="clock-controls-presets"
            label="Presets"
            labelHoverTabContentDisplay={["Presets"]}
          >
            <ControlGroup justifyContent="center">
              <SaveCurrentSettingsAsPresetPopoverButton presetType="Clock Only" />
            </ControlGroup>
            {sortedSimulationPresets["Clock Only"] &&
              sortedSimulationPresets["Clock Only"].map((preset) => (
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
            value="clock-settings"
            label="Clock Settings"
            labelHoverTabContentDisplay={
              clockControlsLabelHoverTabContentDisplay
            }
          >
            <SlimeStoreSliderControl
              label="Size"
              baseInputId="clock-size-slider"
              min={CLOCK_CONTROLS_CONFIGS.size!.min}
              max={CLOCK_CONTROLS_CONFIGS.size!.max}
              step={CLOCK_CONTROLS_CONFIGS.size!.step}
              storePath={["clockSettings", "size"]}
              labelHoverTabContentDisplay={[
                "Clock Size",
                <div className="px-2 py-1">
                  Changes the size of the clock display. Values are a percentage
                  of screen height, where
                  <CodeBlock>1</CodeBlock>
                  would be practically invisible,
                  <CodeBlock>50</CodeBlock>
                  would fill half the screen, and
                  <CodeBlock>100</CodeBlock>
                  would fill the entire screen height.
                </div>,
              ]}
            />
            <SlimeStoreSelectControl
              label="Hour Format"
              baseInputId="clock-hour-format-select"
              placeholder="Hour Format"
              storePath={["clockSettings", "hourFormat"]}
              options={clockFormatOptions}
              labelHoverTabContentDisplay={[
                "Hour Format",
                "12 hour or 24 hour format.",
              ]}
            />
            <SlimeStoreSelectControl
              label="Digit Layout"
              baseInputId="clock-digit-layout-select"
              placeholder="Digit Layout"
              storePath={["clockSettings", "digitLayout"]}
              options={clockDigitLayoutOptions}
              labelHoverTabContentDisplay={[
                "Digit Layout",
                "Changes the layout of the clock digits.",
              ]}
            />
            <SlimeStoreSelectControl
              label="Digit Style"
              baseInputId="clock-digit-style-select"
              placeholder="Digit Style"
              storePath={["clockSettings", "digitStyle"]}
              options={clockStyleOptions}
              labelHoverTabContentDisplay={[
                "Digit Style",
                "Changes the digit style of the clock display.",
              ]}
            />
            <SlimeStoreSwitchControl
              label="Pad Hours"
              baseId="clock-pad-hours-switch"
              storePath={["clockSettings", "padHours"]}
              labelHoverTabContentDisplay={[
                "Pad Hours",
                "Whether to pad hours with a leading zero.",
              ]}
            />
            <SlimeStoreSliderControl
              label="Digit Fade Speed"
              labelHoverTabContentDisplay={[
                "Digit Fade Speed",
                "Changes the speed at which the digits fade in and out when they change. Higher values are faster.",
              ]}
              baseInputId="clock-digit-fade-speed-slider"
              min={CLOCK_CONTROLS_CONFIGS.digitFadeSpeed!.min}
              max={CLOCK_CONTROLS_CONFIGS.digitFadeSpeed!.max}
              step={CLOCK_CONTROLS_CONFIGS.digitFadeSpeed!.step}
              storePath={["clockSettings", "digitFadeSpeed"]}
            />
            <SlimeStoreSwitchControl
              label="Show Clock Shadow"
              baseId="clock-show-shadow-switch"
              storePath={["clockSettings", "showClockShadow"]}
              labelHoverTabContentDisplay={[
                "Show Clock Shadow",
                "Whether to display a transparent shadow of the clock over the simulation.",
              ]}
            />
            <SlimeStoreSliderControl
              label="Clock Shadow Opacity"
              labelHoverTabContentDisplay={[
                "Clock Shadow Opacity",
                "Changes the opacity of the clock shadow.",
              ]}
              baseInputId="clock-shadow-opacity-slider"
              min={CLOCK_CONTROLS_CONFIGS.clockShadowOpacity!.min}
              max={CLOCK_CONTROLS_CONFIGS.clockShadowOpacity!.max}
              step={CLOCK_CONTROLS_CONFIGS.clockShadowOpacity!.step}
              storePath={["clockSettings", "clockShadowOpacity"]}
            />
            <SlimeStoreColorPickerControl
              label="Clock Shadow Color"
              labelHoverTabContentDisplay={[
                "Clock Shadow Color",
                "Changes the color of the clock shadow.",
              ]}
              baseId="clock-shadow-color-picker"
              storePath={["clockSettings", "clockShadowColor"]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
