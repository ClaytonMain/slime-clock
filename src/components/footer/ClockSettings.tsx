import { CLOCK_CONTROLS_BOUNDS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { ClockFormatValue, ClockStyleValue } from "../../types/types";
import SlimeStoreSelect from "../slime-store-select/SlimeStoreSelect";
import SlimeStoreSlider from "../slime-store-slider/SlimeStoreSlider";
import ControlContainer from "./ControlContainer";
import FooterTabContent from "./FooterTabContent";

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

export default function ClockSettings() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);

  return (
    <FooterTabContent tabName="clock-settings" key="clock-settings">
      <div className="mx-auto flex h-auto w-full max-w-sm flex-col bg-amber-200 p-1">
        <SlimeStoreSelect
          selectedOptionValue={clockSettings.style}
          options={clockStyleOptions}
          storePath={["clockSettings", "style"]}
          label="Clock Style"
        />
        <SlimeStoreSelect
          selectedOptionValue={clockSettings.format}
          options={clockFormatOptions}
          storePath={["clockSettings", "format"]}
          label="Clock Format"
        />
        <ControlContainer>
          <SlimeStoreSlider
            label="Clock Size"
            storePath={["clockSettings", "size"]}
            min={CLOCK_CONTROLS_BOUNDS.size!.min}
            max={CLOCK_CONTROLS_BOUNDS.size!.max}
            step={1}
            // labels={["Small", "Medium", "Large"]}
          />
        </ControlContainer>
      </div>
    </FooterTabContent>
  );
}
