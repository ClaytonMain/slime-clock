// Thanks to Miroslav Petrik for the generic select component tutorial
// https://miroslavpetrik.medium.com/lets-create-a-generic-select-component-in-react-typescript-fa720da0e015
// https://codesandbox.io/p/sandbox/generic-native-select-xw7pjg

import type { SelectHTMLAttributes } from "react";
import ControlLabel from "../control-label/ControlLabel";
import { useSelect, type UseSelectParams } from "./useSelect";
import {
  useSelectOptions,
  type UseSelectOptionsParams,
} from "./useSelectOptions";

// More native props should pass through the props
// used only name, for testing purpose
type SelectProps = Pick<SelectHTMLAttributes<HTMLSelectElement>, "name">;

export default function SingleSelectInput<Option>({
  id,
  label,
  displayLabel = "left",
  selectedOption,
  options,
  onChange,
  getLabel,
  tooltipText,
  ...props
}: {
  id: string;
  label: string;
  displayLabel?: boolean | "left";
  tooltipText?: string;
} & UseSelectParams<Option> &
  UseSelectOptionsParams<Option> &
  SelectProps) {
  const selectProps = useSelect({ selectedOption, options, onChange });
  const selectOptions = useSelectOptions({ options, getLabel });

  return (
    <>
      {displayLabel == true && (
        <label
          htmlFor={id}
          className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="flex w-full items-center rounded-lg p-0.5">
        {displayLabel === "left" && (
          <ControlLabel
            labelText={label}
            htmlFor={id}
            displayVariant="left"
            tooltipText={tooltipText}
          />
        )}
        {!displayLabel && (
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
        )}
        <select
          id={id}
          {...props}
          {...selectProps}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          {selectOptions}
        </select>
      </div>
    </>
  );
}
