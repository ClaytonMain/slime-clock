import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Select } from "radix-ui";
import { forwardRef, type ReactNode } from "react";
import type { SelectOption } from "../../types/types";

const SelectItem = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children, ...props }, forwardedRef) => (
    <Select.Item className="bg-amber-200" {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="bg-amber-700">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  ),
);

export default function SlimeStoreSelect<T>({
  triggerAriaLabel,
  placeholder,
  storePath,
  options,
}: {
  triggerAriaLabel?: string;
  placeholder?: string;
  storePath?: string[];
  options: SelectOption<T>[];
}) {
  return (
    <Select.Root>
      <Select.Trigger aria-label={triggerAriaLabel}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal></Select.Portal>
    </Select.Root>
  );
}
