import { Tabs } from "radix-ui";
import type { ReactNode } from "react";

export default function TabContentContainer({
  tabsValue,
  children,
}: {
  tabsValue: string;
  children?: ReactNode;
}) {
  return (
    <Tabs.Content
      value={tabsValue}
      className="flex h-full w-full items-center gap-2"
    >
      {children}
    </Tabs.Content>
  );
}
