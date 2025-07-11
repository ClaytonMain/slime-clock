import { produce } from "immer";
import { motion } from "motion/react";
import { Label, Slider } from "radix-ui";
import * as R from "ramda";
import { useEffect, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreSlider({
  label,
  labelHoverTabContentDisplay,
  baseInputId,
  min,
  max,
  step,
  storePath,
  onValueChange,
  listen = true,
  type = "slider",
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseInputId?: string;
  min?: number;
  max?: number;
  step?: number;
  storePath: string[];
  onValueChange?: (value: number[]) => void;
  listen?: boolean;
  type?: "slider" | "range";
}) {
  const sliderId = `${baseInputId}-slider`;
  const inputId = `${baseInputId}-input`;

  const [selectedValue, setSelectedValue] = useState<number[]>(
    type === "slider"
      ? [R.view(R.lensPath(storePath), useSlimeStore.getState())]
      : R.view(R.lensPath(storePath), useSlimeStore.getState()),
  );

  function handleOnValueChange(value: number[]) {
    if (onValueChange) {
      onValueChange(value);
    } else if (storePath) {
      if (type === "slider") {
        useSlimeStore.setState(R.over(R.lensPath(storePath), () => value[0]));
      } else {
        useSlimeStore.setState(R.over(R.lensPath(storePath), () => value));
      }
    }
    setSelectedValue(value);
  }

  useEffect(() => {
    if (!listen) return;
    const unsub = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(storePath), state),
      (newValue) => {
        if (type === "slider") {
          setSelectedValue([newValue]);
        } else {
          setSelectedValue(newValue);
        }
      },
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePointerOver() {
    if (labelHoverTabContentDisplay) {
      useSlimeStore.setState(
        produce((state) => {
          state.controlsState.displayAreaContentName = null;
          state.controlsState.displayAreaHtmlContent =
            labelHoverTabContentDisplay;
          state.controlsState.displayAreaContentType = "html";
        }),
      );
    }
  }

  return (
    <motion.div
      onPointerOver={handlePointerOver}
      whileHover={{ backgroundColor: "#0004" }}
      className="flex w-full items-center gap-1 py-2.5"
    >
      <div className="flex flex-col items-center p-0.5">
        {label && (
          <Label.Root
            className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium select-none"
            htmlFor={inputId}
          >
            {label}
          </Label.Root>
        )}
      </div>
      <input
        id={inputId}
        type="number"
        value={selectedValue[0]}
        onChange={(e) => handleOnValueChange([Number(e.target.value)])}
        min={min}
        max={max}
        step={step}
        className="h-7 w-18 flex-initial border border-sky-600 bg-zinc-900 px-2 py-1 text-sm text-sky-50"
      />
      <Slider.Root
        id={sliderId}
        value={selectedValue}
        onValueChange={handleOnValueChange}
        min={min}
        max={max}
        step={step}
        className="relative z-0 mr-4 flex h-5 grow touch-none items-center select-none"
      >
        <Slider.Track className="relative h-1 grow bg-zinc-900">
          <Slider.Range className="absolute h-full rounded-full bg-white" />
        </Slider.Track>
        <Slider.Thumb className="shadow-blackA4 hover:bg-violet3 focus:shadow-blackA5 block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_5px] focus:outline-none" />
      </Slider.Root>
    </motion.div>
  );
}
