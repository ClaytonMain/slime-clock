import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Accordion } from "radix-ui";
import TabContentContainer from "./TabContentContainer";
import TabContentDisplayArea from "./TabContentDisplayArea";
import TabContentScrollArea from "./TabContentScrollArea";
import TabContentVerticalSeparator from "./TabContentVerticalSeparator";

export default function ColorControls() {
  return (
    <TabContentContainer tabsValue="color-controls">
      <TabContentScrollArea title="Color">
        <Accordion.Root
          type="single"
          collapsible
          defaultValue="color-controls"
          className="w-full"
        >
          <Accordion.Item
            value="color-controls"
            className="mt-px overflow-hidden first:mt-0"
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger className="flex h-11 flex-1 items-center justify-between px-5 text-lg">
                <span>Color Controls</span>
                <ChevronDownIcon aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden px-5">
              <p>Color controls go here.</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </TabContentScrollArea>
      <TabContentVerticalSeparator />
      <TabContentDisplayArea />
    </TabContentContainer>
  );
}
