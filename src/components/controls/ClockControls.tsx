import { CLOCK_CONTROLS_BOUNDS } from "../../constants/constants";
import type { ClockFormatValue, ClockStyleValue } from "../../types/types";
import SlimeStoreSelect from "./SlimeStoreSelect";
import SlimeStoreSlider from "./SlimeStoreSlider";
import TabContentContainer from "./TabContentContainer";
import TabContentDisplayArea from "./TabContentDisplayArea";
import TabContentScrollArea from "./TabContentScrollArea";
import TabContentVerticalSeparator from "./TabContentVerticalSeparator";

/**
 * Clock Style
 * 7 Segment, Dot Matrix
 */
type ClockStyleOption = {
  value: ClockStyleValue;
  label: string;
};
const clockStyleOptions: ClockStyleOption[] = [
  { value: "7segment", label: "7 Segment" },
  { value: "dotmatrix", label: "Dot Matrix" },
] as const;

/**
 * Clock Format
 * 12 Hour, 24 Hour
 */
type ClockFormatOption = {
  value: ClockFormatValue;
  label: string;
};
const clockFormatOptions: ClockFormatOption[] = [
  { value: "12h", label: "12 Hour" },
  { value: "24h", label: "24 Hour" },
] as const;

export default function ClockControls() {
  return (
    <TabContentContainer tabsValue="clock-controls">
      <TabContentScrollArea title="Clock">
        <SlimeStoreSelect
          label="Style"
          baseInputId="clock-style-select"
          placeholder="Clock Style"
          storePath={["clockSettings", "style"]}
          options={clockStyleOptions}
        />
        <SlimeStoreSelect
          label="Format"
          baseInputId="clock-format-select"
          placeholder="Clock Format"
          storePath={["clockSettings", "format"]}
          options={clockFormatOptions}
        />
        <SlimeStoreSlider
          label="Size"
          baseInputId="clock-size-slider"
          min={CLOCK_CONTROLS_BOUNDS.size!.min}
          max={CLOCK_CONTROLS_BOUNDS.size!.max}
          step={1}
          storePath={["clockSettings", "size"]}
        />
      </TabContentScrollArea>
      <TabContentVerticalSeparator />
      <TabContentDisplayArea />
    </TabContentContainer>
  );
}
