import { ChevronDownIcon } from "@radix-ui/themes";
import { Accordion, ScrollArea, Tabs } from "radix-ui";

export default function ClockControls() {
  return (
    <Tabs.Content value="clock-controls" className="min-h-80">
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <Accordion.Root
            type="single"
            collapsible
            defaultValue="clock-controls"
            className="w-full border border-amber-300"
          >
            <Accordion.Item
              value="clock-controls"
              className="mt-px overflow-hidden first:mt-0"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex h-11 flex-1 items-center justify-between px-5 text-lg">
                  <span>Clock Controls</span>
                  <ChevronDownIcon aria-hidden />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden px-5">
                <p>Clock controls go here.</p>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </Tabs.Content>
  );
}
