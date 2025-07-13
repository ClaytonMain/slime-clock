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
          className="relative h-[25px] w-[42px] cursor-pointer rounded-full"
          animate={{
            backgroundColor: checked
              ? "var(--color-sky-500)"
              : "var(--color-zinc-900)",
          }}
        >
          <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </motion.div>
      </Switch.Root>
    </motion.div>
  );
}
