import * as R from "ramda";
import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreColorPicker({
  storePath,
  onChange,
}: {
  storePath: string[];
  onChange?: (newColor: string) => void;
}) {
  const [color, setColor] = useState(
    R.view(R.lensPath(storePath), useSlimeStore.getState()) as string,
  );

  function handleOnChange(newColor: string) {
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    } else {
      useSlimeStore.setState(R.over(R.lensPath(storePath), () => newColor));
    }
  }

  return (
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
        className="mt-1 w-44 rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
    </div>
  );
}
