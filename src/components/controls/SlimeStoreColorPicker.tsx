import * as R from "ramda";
import { useEffect, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreColorPicker({
  baseId,
  storePath,
  onValueChange,
  listen = true,
}: {
  baseId?: string;
  storePath: string[];
  onValueChange?: (newColor: string) => void;
  listen?: boolean;
}) {
  const [selectedValue, setSelectedValue] = useState<string>(
    R.view(R.lensPath(storePath), useSlimeStore.getState()),
  );

  function handleOnValueChange(newColor: string) {
    if (onValueChange) {
      onValueChange(newColor);
    } else if (storePath) {
      useSlimeStore.setState(R.over(R.lensPath(storePath), () => newColor));
    }
    setSelectedValue(newColor);
  }

  useEffect(() => {
    if (!listen) return;
    const unsub = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(storePath), state),
      (newValue) => {
        setSelectedValue(newValue);
      },
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center gap-5">
      <HexColorInput
        id={`${baseId}-input`}
        color={selectedValue}
        onChange={handleOnValueChange}
        prefixed
        className="h-7 w-20 flex-initial border border-sky-800 bg-zinc-900 px-2 py-1 text-lg text-sky-50 md:text-sm"
      />
      <HexColorPicker
        id={`${baseId}-picker`}
        color={selectedValue}
        onChange={handleOnValueChange}
        className="max-h-24"
      />
    </div>
  );
}
