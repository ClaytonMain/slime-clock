// Thanks to Miroslav Petrik for the generic select component tutorial
// https://miroslavpetrik.medium.com/lets-create-a-generic-select-component-in-react-typescript-fa720da0e015
// https://codesandbox.io/p/sandbox/generic-native-select-xw7pjg

import type { SelectHTMLAttributes } from "react";
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
  selectedOption,
  options,
  onChange,
  getLabel,
  ...props
}: {
  id: string;
  label: string;
} & UseSelectParams<Option> &
  UseSelectOptionsParams<Option> &
  SelectProps) {
  const selectProps = useSelect({ selectedOption, options, onChange });
  const selectOptions = useSelectOptions({ options, getLabel });

  return (
    <div className="mb-1 flex flex-col rounded-lg bg-red-300 p-2">
      <label
        htmlFor={id}
        className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={id}
        {...props}
        {...selectProps}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        {selectOptions}
      </select>
    </div>
  );
}
