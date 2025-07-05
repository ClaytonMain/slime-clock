import { ScrollArea } from "radix-ui";
import type { ReactNode } from "react";

export default function TabContentScrollArea({
  title,
  children,
  childrenPadding,
}: {
  title?: ReactNode;
  children?: ReactNode;
  childrenPadding?: string[];
}) {
  return (
    <div className="flex h-full grow flex-col justify-center backdrop-blur-md">
      {title && (
        <div className="bg-control-container-background-c/40 w-full flex-none text-center text-lg font-light">
          {title}
        </div>
      )}
      <ScrollArea.Root className="bg-control-container-background-c/20 h-64 grow overflow-hidden">
        <ScrollArea.Viewport
          className={
            "text-control-container-text flex size-full flex-col text-sm" +
            (childrenPadding ? ` ${childrenPadding.join(" ")}` : "")
          }
        >
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="bg-scrollbar-background z-40 flex touch-none p-0.5 transition-colors duration-[160ms] ease-out select-none data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
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
