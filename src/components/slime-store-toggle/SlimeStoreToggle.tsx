import { motion } from "motion/react";
import * as R from "ramda";
import { useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreToggle({
  label,
  displayLabel = "left",
  storePath,
  onClick,
}: {
  label: string;
  displayLabel?: boolean | "left";
  storePath: string[];
  onClick?: () => void;
}) {
  const inputId = `${label.toLowerCase().replace(" ", "-")}-toggle-input`;
  const [value, setValue] = useState<boolean>(
    R.view(R.lensPath(storePath), useSlimeStore.getState()),
  );

  function handleOnClick() {
    const newValue = !value;
    setValue(newValue);
    if (onClick) {
      onClick();
    } else {
      useSlimeStore.setState(R.over(R.lensPath(storePath), () => newValue));
    }
  }

  return (
    <>
      {displayLabel === true && (
        <label
          htmlFor={inputId}
          className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="flex w-full content-center rounded-lg p-0.5">
        {displayLabel === "left" && (
          <label
            htmlFor={inputId}
            className="me-1 h-full w-(--footer-left-label-width) flex-none place-content-center rounded-lg p-0.5 text-right text-xs font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
        )}
        {!displayLabel && (
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
        )}
        <motion.button
          id={inputId}
          onClick={handleOnClick}
          className="flex w-16 cursor-pointer items-center rounded-full p-1"
          // layout
          style={{
            backgroundColor: value ? "#3b82f6" : "#374151",
            justifyContent: value ? "flex-end" : "flex-start",
          }}
          transition={{ type: "spring" }}
        >
          <motion.div
            className="h-6 w-6 rounded-full bg-white"
            layout
            transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }}
          />
        </motion.button>
      </div>
    </>
  );
}
