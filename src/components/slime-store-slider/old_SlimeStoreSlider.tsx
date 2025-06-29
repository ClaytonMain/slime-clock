import * as R from "ramda";
import { useEffect, useState, type ChangeEvent } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import ControlLabel from "../control-label/old_ControlLabel";

export default function SlimeStoreSlider({
  label,
  storePath,
  min,
  max,
  step = 1,
  labels = [],
  onChange,
  displayLabel = "left",
  listen = true,
  tooltipText,
  baseId,
}: {
  label: string;
  storePath: string[];
  min: number;
  max: number;
  step?: number;
  labels?: string[];
  onChange?: (value: number) => void;
  displayLabel?: boolean | "left";
  listen?: boolean;
  tooltipText?: string;
  baseId?: string; // Optional base ID for the input elements
}) {
  const textInputId = `${baseId ?? label.toLowerCase().replace(" ", "-")}-text-input`;
  const rangeInputId = `${baseId ?? label.toLowerCase().replace(" ", "-")}-range-input`;
  const [value, setValue] = useState(
    R.view(R.lensPath(storePath), useSlimeStore.getState()) as number,
  );

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = Number(event.target.value);
    if (Number.isNaN(newValue)) return;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    } else {
      useSlimeStore.setState(R.over(R.lensPath(storePath!), () => newValue));
    }
  }

  useEffect(() => {
    if (!listen) return;
    const unsub = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(storePath), state),
      (newValue) => {
        setValue(newValue);
      },
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {displayLabel === true && (
        <label
          htmlFor={textInputId}
          className="text-label-text-a mb-1 text-sm font-medium"
        >
          {label}
        </label>
      )}
      <div className="flex w-full items-center rounded-sm p-0.5">
        {displayLabel === "left" && (
          <ControlLabel
            labelText={label}
            htmlFor={textInputId}
            displayVariant="left"
            tooltipText={tooltipText}
          />
        )}
        <input
          id={textInputId}
          type="number"
          value={value}
          onChange={handleOnChange}
          min={min}
          max={max}
          step={step}
          className="text-input-text-c border-input-border-b bg-input-background-a w-20 flex-initial rounded-sm border px-2.5 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <label htmlFor={rangeInputId} className="sr-only">
          {`${label} Slider`}
        </label>
        <div className="ml-2 h-full w-44 flex-auto flex-col">
          <input
            id={rangeInputId}
            type="range"
            value={value}
            onChange={handleOnChange}
            min={min}
            max={max}
            step={step}
            className="bg-input-background-a h-1 w-full cursor-pointer appearance-none rounded-sm"
          />
          {labels.length > 0 && (
            <div className="flex w-full justify-between">
              {labels.map((label, index) => {
                return (
                  <span key={index} className={`text-label-text-a text-sm`}>
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
