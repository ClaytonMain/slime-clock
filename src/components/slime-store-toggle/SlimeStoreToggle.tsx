import { motion } from "motion/react";
import * as R from "ramda";
import { useRef } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreToggle({
  label,
  storePath,
  onClick,
}: {
  label: string;
  storePath: string[];
  onClick?: () => void;
}) {
  const inputId = `${label.toLowerCase().replace(" ", "-")}-toggle-input`;
  const valueRef = useRef(
    R.view(R.lensPath(storePath), useSlimeStore.getState()),
  );

  function handleOnClick() {
    const newValue = !valueRef.current;
    valueRef.current = newValue;
    if (onClick) {
      onClick();
    } else {
      useSlimeStore.setState(R.over(R.lensPath(storePath), () => newValue));
    }
  }

  return (
    <div className="mb-1 flex flex-col rounded-lg bg-red-300 p-2">
      <label
        htmlFor={inputId}
        className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <motion.button
        id={inputId}
        onClick={handleOnClick}
        className="flex w-16 cursor-pointer rounded-full p-1"
        animate={{
          backgroundColor: valueRef.current ? "#3b82f6" : "#374151",
          justifyContent: valueRef.current ? "flex-end" : "flex-start",
        }}
      >
        <motion.div
          className="h-6 w-6 rounded-full bg-white"
          layout
          animate={{
            justifySelf: valueRef.current ? "flex-end" : "flex-start",
          }}
          transition={{ type: "spring" }}
        />
      </motion.button>
    </div>
  );
}
