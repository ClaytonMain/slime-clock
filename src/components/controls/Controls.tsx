import { Dialog, Separator, Tabs, VisuallyHidden } from "radix-ui";
import ClockControls from "./ClockControls";
import ColorControls from "./ColorControls";
import SimulationControls from "./SimulationControls";
import TabButton from "./TabButton";

export default function Controls() {
  return (
    <Dialog.Root>
      <div className="fixed bottom-0 left-0 flex w-full justify-center gap-3 bg-sky-950 p-4">
        <Dialog.Trigger>Controls</Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10" />
        <Dialog.Content className="bg-controls-background/70 text-control-container-text border-control-container-text fixed top-1/2 left-1/2 max-h-10/12 w-9/12 max-w-2xl -translate-1/2 rounded-xs border border-dashed px-10 py-6 backdrop-blur-md">
          <VisuallyHidden.Root>
            <Dialog.Title>Controls</Dialog.Title>
            <Dialog.Description>
              This dialog contains various controls for the application.
            </Dialog.Description>
          </VisuallyHidden.Root>

          <Tabs.Root defaultValue="clock-controls">
            <Tabs.List className="flex w-full justify-center gap-4">
              <TabButton tabName="clock-controls" />
              <TabButton tabName="simulation-controls" />
              <TabButton tabName="color-controls" />
            </Tabs.List>

            <Separator.Root className="border-control-container-text my-4 h-px w-full border-b" />

            <div className="border-control-container-text border p-2">
              <ClockControls />
              <SimulationControls />
              <ColorControls />
            </div>
          </Tabs.Root>

          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
