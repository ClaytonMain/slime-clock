import { Accordion } from "radix-ui";
import * as R from "ramda";
import { useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function AccordionControlsWrapper({
  type = "single",
  defaultValue,
  collapsible,
  children,
  accordionId,
}: {
  type?: "single" | "multiple";
  defaultValue: string | string[];
  collapsible?: boolean;
  children: ReactNode;
  accordionId: string;
}) {
  const [value, setValue] = useState<string | string[]>(
    R.view(
      R.lensPath(["controlsState", "accordionValues", accordionId]),
      useSlimeStore.getState(),
    ) || defaultValue,
  );

  function handleValueChange(newValue: string | string[]) {
    useSlimeStore.setState(
      R.set(
        R.lensPath(["controlsState", "accordionValues", accordionId]),
        newValue,
      ),
    );
    setValue(newValue);
  }

  return (
    // @ts-expect-error Just remember that if type is "single", defaultValue must be a string, and if type is "multiple", defaultValue must be a string array.
    <Accordion.Root
      id={accordionId}
      type={type}
      value={value}
      onValueChange={handleValueChange}
      collapsible={collapsible}
      className="flex w-full flex-col"
    >
      {children}
    </Accordion.Root>
  );
}
