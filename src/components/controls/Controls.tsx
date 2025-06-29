import { Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, Tabs, VisuallyHidden } from "radix-ui";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockControls from "./ClockControls";
import ColorControls from "./ColorControls";
import SimulationControls from "./SimulationControls";
import TabButton from "./TabButton";

export default function Controls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  return (
    <Dialog.Root>
      <div className="fixed bottom-0 left-0 flex w-full justify-center gap-3 bg-sky-950 p-4">
        <Dialog.Trigger>Controls</Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/10" />
        <Dialog.Content className="bg-controls-background/70 text-control-container-text border-control-container-text fixed top-1/2 left-1/2 flex h-96 max-h-10/12 w-9/12 max-w-2xl -translate-1/2 flex-col gap-3 rounded-xs border border-dashed p-3 backdrop-blur-xs">
          <VisuallyHidden.Root>
            <Dialog.Title>Controls</Dialog.Title>
            <Dialog.Description>
              This dialog contains various controls for the application.
            </Dialog.Description>
          </VisuallyHidden.Root>

          <Tabs.Root value={selectedTab} className="flex h-full flex-col gap-3">
            <Dialog.Close
              aria-label="Close"
              className="bg-tab-button-background absolute top-3 right-3 z-[1] inline-flex cursor-pointer appearance-none rounded-full p-1"
            >
              <Cross2Icon className="h-6 w-6" />
            </Dialog.Close>
            {/* <Separator.Root className="border-control-container-text my-4 h-px w-full border-b" /> */}

            <div className="grow border border-dashed border-emerald-400 p-2">
              <ClockControls />
              <SimulationControls />
              <ColorControls />
            </div>

            <Tabs.List className="flex w-full justify-center gap-3 border border-dashed border-rose-500">
              <TabButton tabName="clock-controls" />
              <TabButton tabName="simulation-controls" />
              <TabButton tabName="color-controls" />
            </Tabs.List>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
