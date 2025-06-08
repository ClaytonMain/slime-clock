import * as R from "ramda";
import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreColorPicker({
  label,
  storePath,
  onChange,
}: {
  label: string;
  storePath: string[];
  onChange?: (newColor: string) => void;
}) {
  const inputId = `${label.toLowerCase().replace(" ", "-")}-color-picker-input`;
  const ramdaSet = useSlimeStore((state) => state.ramdaSet);
  const [color, setColor] = useState(
    R.view(R.lensPath(storePath), useSlimeStore.getState()) as string,
  );

  function handleOnChange(newColor: string) {
    console.log("New color:", newColor);
    if (onChange) {
      onChange(newColor);
    } else {
      ramdaSet(storePath, () => newColor);
    }
    setColor(newColor);
  }

  return (
    <div className="mb-1 flex flex-col rounded-lg bg-red-300 p-2">
      <label
        htmlFor={inputId}
        className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <div className="flex h-44 w-full flex-col items-center">
        <HexColorPicker
          color={color}
          onChange={handleOnChange}
          className="max-w-44"
        />
        <HexColorInput
          color={color}
          onChange={handleOnChange}
          prefixed
          className="mt-1 w-44 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
