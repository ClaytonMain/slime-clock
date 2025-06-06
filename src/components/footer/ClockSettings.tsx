import { produce } from "immer";
import { useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { ClockFormatValue, ClockStyleValue } from "../../types/types";
import SingleSelectInput from "../single-select-input/SingleSelectInput";
import FooterTabContent from "./FooterTabContent";

/**
 * Shared
 */
type SelectOption<T> = {
  value: T;
  label: string;
};
function getSelectedOption<T extends SelectOption<unknown>>(
  options: T[],
  value: T["value"]
): T {
  return (options.find((option) => option.value === value) || options[0]) as T;
}
const getLabel = ({ label }: SelectOption<unknown>) => label;

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

const getClockStyleLabel = ({ label }: ClockStyleOption) => label;

function ClockStyleSelect({
  selectedOptionValue,
}: {
  selectedOptionValue: ClockStyleValue;
}) {
  const [selectedOption, setSelectedOption] = useState(
    getSelectedOption(clockStyleOptions, selectedOptionValue)
  );
  function handleOnChange(option: ClockStyleOption) {
    console.log("Clock Style changed to:", option.value);
    setSelectedOption(option);
    useSlimeStore.setState(
      produce((state) => {
        state.clockSettings.style = option;
      })
    );
  }
  return (
    <SingleSelectInput
      id="clock-style-select"
      label="Clock Style"
      selectedOption={selectedOption}
      options={clockStyleOptions}
      getLabel={getClockStyleLabel}
      onChange={handleOnChange}
    />
  );
}

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
const getClockFormatLabel = ({ label }: ClockFormatOption) => label;
function ClockFormatSelect({
  selectedOptionValue,
}: {
  selectedOptionValue: ClockFormatValue;
}) {
  const [selectedOption, setSelectedOption] = useState(
    getSelectedOption(clockFormatOptions, selectedOptionValue)
  );
  function handleOnChange(option: ClockFormatOption) {
    console.log("Clock Format changed to:", option.value);
    setSelectedOption(option);
    useSlimeStore.setState(
      produce((state) => {
        state.clockSettings.format = option;
      })
    );
  }
  return (
    <SingleSelectInput
      id="clock-format-select"
      label="Clock Format"
      selectedOption={selectedOption}
      options={clockFormatOptions}
      getLabel={getClockFormatLabel}
      onChange={handleOnChange}
    />
  );
}

export default function ClockSettings() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);

  return (
    <FooterTabContent
      tabName="clock-settings"
      key="clock-settings"
    >
      <div className="max-w-sm flex flex-col bg-amber-200 w-full mx-auto">
        <ClockStyleSelect selectedOptionValue={clockSettings.style} />
        <ClockFormatSelect selectedOptionValue={clockSettings.format} />
      </div>
    </FooterTabContent>
  );
}
