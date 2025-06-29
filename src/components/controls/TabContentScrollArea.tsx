import { ScrollArea } from "radix-ui";

export default function TabContentScrollArea({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-auto grow flex-col gap-1">
      <div className="bg-control-container-background-c/20 w-full flex-none rounded-xs px-3 py-1">
        {title}
      </div>
      <ScrollArea.Root className="bg-control-container-background-c/10 h-64 overflow-hidden rounded-xs backdrop-blur-md">
        <ScrollArea.Viewport className="text-control-container-text flex size-full flex-col">
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="bg-scrollbar-background flex touch-none p-0.5 transition-colors duration-[160ms] ease-out select-none data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="bg-scrollbar-thumb relative flex-1 rounded-[10px] before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar
          className="bg-scrollbar-background hover:bg-blackA5 flex touch-none p-0.5 transition-colors duration-[160ms] ease-out select-none data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="bg-scrollbar-thumb relative flex-1 rounded-[10px] before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-scrollbar-background" />
      </ScrollArea.Root>
    </div>
  );
}
