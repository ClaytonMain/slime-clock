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
    <div className="flex h-32 w-full flex-col items-center">
      <HexColorPicker
        color={color}
        onChange={handleOnChange}
        className="max-w-44"
        style={{ borderRadius: "var(--radius-sm)" }}
      />
      <HexColorInput
        color={color}
        onChange={handleOnChange}
        prefixed
        className="text-input-text-c border-input-border-b bg-input-background-a mt-1 w-44 rounded-sm border p-1.5 text-center text-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}
