import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Accordion } from "radix-ui";
import type { ReactNode } from "react";

export default function AccordionControlsItem({
  value,
  label,
  children,
}: {
  value: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Accordion.Item
      value={value}
      className="focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t-xs last:rounded-b-xs focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger className="group bg-mauve1 text-violet11 shadow-mauve6 hover:bg-mauve2 sticky flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none">
          {label}
          <ChevronDownIcon
            className="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="bg-mauve2 text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden text-[15px]">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
}
