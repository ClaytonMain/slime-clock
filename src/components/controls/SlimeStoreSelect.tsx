import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { Label, Select } from "radix-ui";
import * as R from "ramda";
import { forwardRef, useEffect, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { SelectOption } from "../../types/types";

const SelectItem = forwardRef<HTMLDivElement, Select.SelectItemProps>(
  ({ children, ...props }, forwardedRef) => (
    <Select.Item
      className="text-violet11 data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 relative flex h-[25px] items-center rounded-[3px] pr-[35px] pl-[25px] text-[13px] leading-none select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none"
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  ),
);

export default function SlimeStoreSelect({
  label,
  baseInputId,
  placeholder,
  storePath,
  options,
  onValueChange,
  listen = true,
  valueType = "string",
}: {
  label?: string;
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

  return (
    <div className="flex w-full items-center gap-1 rounded-xs p-0.5">
      <div className="flex flex-col items-center rounded-xs p-0.5">
        {label && (
          <Label.Root
            className="text-label-text-a h-full w-(--footer-left-label-width) flex-none place-content-center rounded-xs p-0.5 text-right text-sm leading-none font-medium"
            htmlFor={baseInputId}
          >
            {label}
          </Label.Root>
        )}
      </div>
      <Select.Root value={selectedValue} onValueChange={handleOnValueChange}>
        <Select.Trigger
          className="bg-input-background-a border-input-border-b inline-flex h-7 items-center justify-center gap-1 rounded-xs border px-2 py-1 text-sm leading-none font-medium shadow-[0_2px_10px] shadow-black/10 outline-none"
          id={baseInputId}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="text-label-text-a bg-input-background-a overflow-hidden rounded-xs shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.ScrollUpButton className="bg-input-background-a flex h-6 cursor-default items-center justify-center">
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
            <Select.ScrollDownButton className="bg-input-background-a flex h-6 cursor-default items-center justify-center">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
