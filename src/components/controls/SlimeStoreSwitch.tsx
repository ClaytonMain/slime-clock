import { produce } from "immer";
import { motion } from "motion/react";
import { Label, Switch } from "radix-ui";
import * as R from "ramda";
import { useEffect, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreSwitch({
  label,
  labelHoverTabContentDisplay,
  baseId,
  storePath,
  onCheckedChange,
  listen = true,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseId?: string;
  storePath: string[];
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
      className="flex w-full items-center gap-1 py-2"
    >
      <div className="flex flex-col items-center p-0.5">
        {label && (
          <Label.Root
            className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium"
            htmlFor={baseId}
          >
            {label}
          </Label.Root>
        )}
      </div>
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
            justifyContent: checked ? "flex-end" : "flex-start",
          }}
        >
          <Switch.Thumb asChild>
            <motion.div
              className="h-5 w-5 rounded-full bg-white"
              transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
              layout
            />
          </Switch.Thumb>
        </motion.div>
      </Switch.Root>
    </motion.div>
  );
}
