import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { produce } from "immer";
import { motion } from "motion/react";
import { Label, Select } from "radix-ui";
import * as R from "ramda";
import { forwardRef, useEffect, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { SelectOption } from "../../types/types";

const SelectItem = forwardRef<HTMLDivElement, Select.SelectItemProps>(
  ({ children, ...props }, forwardedRef) => (
    <Select.Item asChild {...props} ref={forwardedRef}>
      <motion.div
        className="relative flex h-6 items-center pr-9 pl-6 text-sm leading-none text-sky-50 select-none data-[disabled]:pointer-events-none data-[disabled]:text-zinc-500"
        whileHover={{ backgroundColor: "var(--color-zinc-800)" }}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </motion.div>
    </Select.Item>
  ),
);

export default function SlimeStoreSelect({
  label,
  labelHoverTabContentDisplay,
  baseInputId,
  placeholder,
  storePath,
  options,
  onValueChange,
  listen = true,
  valueType = "string",
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseInputId?: string;
  placeholder?: string;
  storePath: string[];
  options: SelectOption<string>[];
  onValueChange?: (value: string) => void;
  listen?: boolean;
  valueType?: "string" | "number";
}) {
  const [selectedValue, setSelectedValue] = useState<string>(
    valueType === "string"
      ? R.view(R.lensPath(storePath), useSlimeStore.getState())
      : String(R.view(R.lensPath(storePath), useSlimeStore.getState())),
  );

  function handleOnValueChange(value: string) {
    if (onValueChange) {
      onValueChange(value);
    } else if (storePath) {
      if (valueType === "number") {
        useSlimeStore.setState(
          R.over(R.lensPath(storePath), () => Number(value)),
        );
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
        if (valueType === "number") {
          setSelectedValue(String(newValue));
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
    <div className="flex w-full items-center gap-1 py-2">
      <div className="flex flex-col items-center p-0.5">
        {label && (
          <Label.Root
            onPointerOver={handlePointerOver}
            className="h-full w-(--footer-left-label-width) flex-none place-content-center p-0.5 text-right text-xs leading-none font-medium"
            htmlFor={baseInputId}
          >
            {label}
          </Label.Root>
        )}
      </div>
      <Select.Root value={selectedValue} onValueChange={handleOnValueChange}>
        <Select.Trigger
          className="inline-flex h-7 items-center justify-center gap-1 border border-sky-600 bg-zinc-900 px-2 py-1 text-sm leading-none font-medium shadow-[0_2px_10px] shadow-black/10 outline-none"
          id={baseInputId}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-zinc-700">
            <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-zinc-700 text-sky-50">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1">
              <Select.Group>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-zinc-900">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
