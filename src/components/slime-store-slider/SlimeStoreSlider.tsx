import * as R from "ramda";
import { useRef, type ChangeEvent } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreSlider({
  label,
  storePath,
  min,
  max,
  step = 1,
  labels = [],
  onChange,
}: {
  label: string;
  storePath: string[];
  min: number;
  max: number;
  step?: number;
  labels?: string[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const textInputId = `${label.toLowerCase().replace(" ", "-")}-text-input`;
  const rangeInputId = `${label.toLowerCase().replace(" ", "-")}-range-input`;
  const valueRef = useRef(
    R.view(R.lensPath(storePath), useSlimeStore.getState()),
  );

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = Number(event.target.value);
    if (Number.isNaN(newValue)) return;
    valueRef.current = newValue;
    if (onChange) {
      onChange(event);
    } else {
      useSlimeStore.setState(R.over(R.lensPath(storePath), () => newValue));
    }
  }

  return (
    <div className="mb-1 flex flex-col rounded-lg bg-red-300 p-2">
      <label
        htmlFor={textInputId}
        className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <div className="flex w-full content-center">
        <input
          id={textInputId}
          type="number"
          value={valueRef.current}
          onChange={handleOnChange}
          min={min}
          max={max}
          step={step}
          className="shrink rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <label htmlFor={rangeInputId} className="sr-only">
          {`${label} Slider`}
        </label>
        <div className="ml-2 flex grow flex-col place-content-center">
          <input
            id={rangeInputId}
            type="range"
            value={valueRef.current}
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
    </div>
  );
}
