import { ChevronDownIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { Accordion } from "radix-ui";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function AccordionControlsItem({
  value,
  label,
  labelHoverTabContentDisplay,
  children,
}: {
  value: string;
  label: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  children: ReactNode;
}) {
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
    <Accordion.Item
      value={value}
      className="focus-within:shadow-mauve12 overflow-clip focus-within:relative focus-within:z-20 focus-within:shadow-[0_0_0_2px]"
    >
      <Accordion.Header className="sticky top-0 z-30 flex">
        <Accordion.Trigger
          onPointerOver={handlePointerOver}
          className="group bg-control-container-background-a text-violet11 shadow-mauve6 hover:bg-mauve2 flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none"
        >
          {label}
          <ChevronDownIcon
            className="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="bg-mauve2 text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden py-1 text-[15px]">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
}
