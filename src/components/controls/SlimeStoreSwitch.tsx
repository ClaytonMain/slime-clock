import { motion } from "motion/react";
import { Switch } from "radix-ui";
import * as R from "ramda";
import { useEffect, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreSwitch({
  baseId,
  storePath,
  onCheckedChange,
  listen = true,
}: {
  baseId?: string;
  storePath: (string | number)[];
  onCheckedChange?: (value: boolean) => void;
  listen?: boolean;
}) {
  const [checked, setChecked] = useState<boolean>(
    R.view(R.lensPath(storePath), useSlimeStore.getState()),
  );

  function handleOnCheckedChange(value: boolean) {
    if (onCheckedChange) {
      onCheckedChange(value);
    } else if (storePath) {
      useSlimeStore.setState(R.over(R.lensPath(storePath), () => value));
    }
    setChecked(value);
  }

  useEffect(() => {
    if (!listen) return;
    const unsub = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(storePath), state),
      (newChecked) => {
        setChecked(newChecked);
      },
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch.Root
      id={baseId}
      checked={checked}
      onCheckedChange={handleOnCheckedChange}
      asChild
    >
      <motion.div
        className="flex h-6 w-12 cursor-pointer items-center rounded-full p-0.5"
        animate={{
          backgroundColor: checked
            ? "var(--color-sky-500)"
            : "var(--color-zinc-900)",
        }}
        style={{
          backgroundColor: "var(--color-zinc-900)",
          justifyContent: checked ? "flex-end" : "flex-start",
        }}
      >
        <Switch.Thumb asChild>
          <motion.div
            className="h-5 w-5 rounded-full bg-white"
            transition={{
              type: "spring",
              visualDuration: 0.3,
              bounce: 0.2,
            }}
            layout
          />
        </Switch.Thumb>
      </motion.div>
    </Switch.Root>
  );
}
