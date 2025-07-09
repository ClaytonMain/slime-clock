import { Separator } from "radix-ui";

export default function TabContentVerticalSeparator() {
  return (
    <Separator.Root
      orientation="horizontal"
      className="flex h-11/12 w-px border-r border-sky-50"
    />
  );
}
