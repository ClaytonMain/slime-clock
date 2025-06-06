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
    <div className="bg-red-300 p-4 rounded-lg mb-1">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={id}
        {...props}
        {...selectProps}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {selectOptions}
      </select>
    </div>
  );
}
