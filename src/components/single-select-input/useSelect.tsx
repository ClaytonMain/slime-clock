// Thanks to Miroslav Petrik for the generic select component tutorial
// https://miroslavpetrik.medium.com/lets-create-a-generic-select-component-in-react-typescript-fa720da0e015
// https://codesandbox.io/p/sandbox/generic-native-select-xw7pjg

import { type ChangeEvent, useCallback } from "react";

export type UseSelectParams<Option> = {
  selectedOption: Option;
  options: readonly Option[];
  onChange: (option: Option) => void;
};

type UseSelect = {
  value: number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export function useSelect<Option>({
  selectedOption,
  options,
  onChange,
}: UseSelectParams<Option>): UseSelect {
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextOption = options[event.currentTarget.selectedIndex];
      if (nextOption !== undefined) {
        onChange(nextOption);
      }
    },
    [options, onChange]
  );

  return { value: options.indexOf(selectedOption), onChange: onChangeCallback };
}
