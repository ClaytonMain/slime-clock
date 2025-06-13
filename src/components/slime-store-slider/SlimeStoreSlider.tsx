import * as R from "ramda";
import { useState, type ChangeEvent } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreSlider({
  label,
  storePath,
  min,
  max,
  step = 1,
  labels = [],
  onChange,
  displayLabel = true,
}: {
  label: string;
  storePath: string[];
  min: number;
  max: number;
  step?: number;
  labels?: string[];
  onChange?: (value: number) => void;
  displayLabel?: boolean | "left";
}) {
  const textInputId = `${label.toLowerCase().replace(" ", "-")}-text-input`;
  const rangeInputId = `${label.toLowerCase().replace(" ", "-")}-range-input`;
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

  return (
    <>
      {displayLabel === true && (
        <label
          htmlFor={textInputId}
          className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="flex w-full content-center rounded-lg p-0.5">
        {displayLabel === "left" && (
          <label
            htmlFor={textInputId}
            className="me-1 h-full w-16 flex-none place-content-center rounded-lg p-0.5 text-right text-xs font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
        )}
        <input
          id={textInputId}
          type="number"
          value={value}
          onChange={handleOnChange}
          min={min}
          max={max}
          step={step}
          className="w-20 flex-initial rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <label htmlFor={rangeInputId} className="sr-only">
          {`${label} Slider`}
        </label>
        <div className="ml-2 h-full w-44 flex-auto flex-col place-content-center">
          <input
            id={rangeInputId}
            type="range"
            value={value}
            onChange={handleOnChange}
            min={min}
            max={max}
            step={step}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
          />
          {labels.length > 0 && (
            <div className="flex w-full justify-between">
              {labels.map((label, index) => {
                return (
                  <span
                    key={index}
                    className={`text-sm text-gray-500 dark:text-gray-400`}
                  >
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
