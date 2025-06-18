import * as R from "ramda";
import { useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { SelectOption } from "../../types/types";
import SingleSelectInput from "../single-select-input/SingleSelectInput";

function getSelectedOption<T extends SelectOption<unknown>>(
  options: T[],
  value: T["value"],
): T {
  return (options.find((option) => option.value === value) || options[0]) as T;
}
const getLabel = ({ label }: SelectOption<unknown>) => label;

export default function SlimeStoreSelect<T>({
  label,
  displayLabel = false,
  selectedOptionValue,
  options,
  storePath,
  onChange,
}: {
  label: string;
  displayLabel?: boolean;
  selectedOptionValue: T;
  options: SelectOption<T>[];
  storePath: string[];
  onChange?: (option: SelectOption<T>) => void;
}) {
  const [selectedOption, setSelectedOption] = useState(
    getSelectedOption(options, selectedOptionValue),
  );

  function handleOnChange(option: SelectOption<T>) {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    } else {
      useSlimeStore.setState(R.over(R.lensPath(storePath), () => option.value));
    }
  }

  return (
    <SingleSelectInput
      id={`${label.toLowerCase().replace(" ", "-")}-select`}
      label={label}
      displayLabel={displayLabel}
      selectedOption={selectedOption}
      options={options}
      getLabel={getLabel}
      onChange={handleOnChange}
    />
  );
}
