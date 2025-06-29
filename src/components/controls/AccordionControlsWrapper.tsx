import { Accordion } from "radix-ui";
import type { ReactNode } from "react";

export default function AccordionControlsWrapper({
  type = "single",
  defaultValue,
  collapsible,
  children,
}: {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
  children: ReactNode;
}) {
  return (
    // @ts-expect-error Just remember that if type is "single", defaultValue must be a string, and if type is "multiple", defaultValue must be a string array.
    <Accordion.Root
      type={type}
      defaultValue={defaultValue}
      collapsible={collapsible}
      className="flex w-full flex-col"
    >
      {children}
    </Accordion.Root>
  );
}
