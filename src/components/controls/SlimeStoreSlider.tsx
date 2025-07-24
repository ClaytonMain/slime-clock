import { motion } from "motion/react";
import { Slider } from "radix-ui";
import * as R from "ramda";
import { useEffect, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreSlider({
  baseInputId,
  min,
  max,
  step,
  storePath,
  onValueChange,
  listen = true,
  type = "slider",
  hideSlider = false,
  boundValue = true,
}: {
  baseInputId?: string;
  min: number;
  max: number;
  step?: number;
  storePath: string[];
  onValueChange?: (value: [number] | [number, number]) => void;
  listen?: boolean;
  type?: "slider" | "range";
  hideSlider?: boolean; // I just didn't want to write a `SlimeStoreInput` component for this.
  boundValue?: boolean;
}) {
  const sliderId = `${baseInputId}-slider`;
  const inputId = `${baseInputId}-input`;

  const [selectedValue, setSelectedValue] = useState<
    [number] | [number, number]
  >(
    type === "slider"
      ? [R.view(R.lensPath(storePath), useSlimeStore.getState())]
      : R.view(R.lensPath(storePath), useSlimeStore.getState()),
  );

  function handleOnValueChange(value: [number] | [number, number]) {
    let processedValue = value;
    if (boundValue) {
      processedValue = value.map((v) => Math.min(Math.max(v, min), max)) as
        | [number]
        | [number, number];
    }
    processedValue = processedValue.sort((a, b) => a - b) as
      | [number]
      | [number, number];
    if (onValueChange) {
      onValueChange(processedValue);
    } else {
      if (type === "slider") {
        useSlimeStore.setState(
          R.over(R.lensPath(storePath), () => processedValue[0]),
        );
      } else {
        useSlimeStore.setState(
          R.over(R.lensPath(storePath), () => processedValue),
        );
      }
    }
    setSelectedValue(processedValue);
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

  return (
    <div
      className="flex w-full items-center gap-1"
      style={{
        flexDirection: type === "slider" ? "row" : "column",
      }}
    >
      {type === "slider" && (
        <input
          id={inputId}
          type="number"
          value={selectedValue[0]}
          onChange={(e) => handleOnValueChange([Number(e.target.value)])}
          min={min}
          max={max}
          step={step}
          className="h-7 w-18 flex-initial border border-sky-800 bg-zinc-900 px-2 py-1 text-lg text-sky-50 md:text-sm"
        />
      )}
      {type === "range" && (
        <div className="order-last flex w-full items-center justify-center gap-1">
          <input
            id={`${inputId}-min`}
            type="number"
            value={selectedValue[0]}
            onChange={(e) =>
              handleOnValueChange([
                Number(e.target.value),
                selectedValue[1] as number,
              ])
            }
            min={min}
            max={max}
            step={step}
            className="h-7 w-18 flex-initial border border-sky-800 bg-zinc-900 px-2 py-1 text-lg text-sky-50 md:text-sm"
          />
          <input
            id={`${inputId}-max`}
            type="number"
            value={selectedValue[1]}
            onChange={(e) =>
              handleOnValueChange([
                selectedValue[0] as number,
                Number(e.target.value),
              ])
            }
            min={min}
            max={max}
            step={step}
            className="h-7 w-18 flex-initial border border-sky-800 bg-zinc-900 px-2 py-1 text-lg text-sky-50 md:text-sm"
          />
        </div>
      )}
      <div className="flex w-full items-center justify-center">
        {!hideSlider && (
          <Slider.Root
            id={sliderId}
            value={selectedValue}
            onValueChange={handleOnValueChange}
            min={min}
            max={max}
            step={step}
            className="relative z-0 mr-4 flex h-5 grow touch-none items-center select-none"
            minStepsBetweenThumbs={type === "range" ? step : undefined}
          >
            <Slider.Track className="relative h-1.5 grow rounded-full border border-sky-800 bg-zinc-900">
              <Slider.Range className="absolute h-full rounded-full bg-sky-500" />
            </Slider.Track>
            <Slider.Thumb asChild>
              <motion.div
                className="block size-5 rounded-[10px] focus:shadow-[0_0_0_5px] focus:shadow-sky-600 focus:outline-none"
                whileHover={{ backgroundColor: "var(--color-sky-100)" }}
                style={{ backgroundColor: "var(--color-sky-50)" }}
              />
            </Slider.Thumb>
            {type === "range" && (
              <Slider.Thumb asChild>
                <motion.div
                  className="block size-5 rounded-[10px] focus:shadow-[0_0_0_5px] focus:shadow-sky-600 focus:outline-none"
                  whileHover={{ backgroundColor: "var(--color-sky-100)" }}
                  style={{ backgroundColor: "var(--color-sky-50)" }}
                />
              </Slider.Thumb>
            )}
          </Slider.Root>
        )}
      </div>
    </div>
  );
}
