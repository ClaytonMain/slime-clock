import { Cross2Icon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { Dialog, Separator, Tabs, VisuallyHidden } from "radix-ui";
import useSlimeStore from "../../stores/useSlimeStore";
import ClockControls from "./ClockControls";
import ColorControls from "./ColorControls";
import SimulationControls from "./SimulationControls";
import TabButton from "./TabButton";
import TabContentDisplayArea from "./TabContentDisplayArea";
import TabContentVerticalSeparator from "./TabContentVerticalSeparator";

export default function Controls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const isOpen = useSlimeStore((state) => state.controlsState.isOpen);

  function handleOpenChange(open: boolean) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.isOpen = open;
      }),
    );
  }

  return (
    <div className="absolute bottom-0 left-0 h-full w-full">
      <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
        <div className="absolute bottom-0 left-0 flex w-full justify-center gap-3 bg-sky-950 p-4">
          <Dialog.Trigger>Controls</Dialog.Trigger>
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0" />
          <Dialog.Content className="text-control-container-text border-control-container-text fixed top-1/2 left-1/2 flex h-96 max-h-11/12 w-9/12 max-w-2xl -translate-1/2 flex-col rounded-xs border border-dashed">
            <VisuallyHidden.Root>
              <Dialog.Title>Controls</Dialog.Title>
              <Dialog.Description>
                This dialog contains various controls for the application.
              </Dialog.Description>
            </VisuallyHidden.Root>

            <Tabs.Root
              value={selectedTab}
              className="flex h-full flex-col items-center"
            >
              <Dialog.Close
                aria-label="Close"
                className="bg-tab-button-background absolute top-3 right-3 z-[1] inline-flex cursor-pointer appearance-none rounded-full p-1"
              >
                <Cross2Icon className="h-6 w-6" />
              </Dialog.Close>

              <div className="flex w-full grow items-center">
                <div className="flex h-full grow items-center px-2 py-3 backdrop-blur-sm">
                  <ClockControls />
                  <SimulationControls />
                  <ColorControls />
                </div>
                <TabContentVerticalSeparator />
                <TabContentDisplayArea />
              </div>

              <Separator.Root className="border-control-container-text h-px w-11/12 border-b" />

              <Tabs.List className="flex w-full justify-center gap-3 py-2 backdrop-blur-sm">
                <TabButton tabName="clock-controls" />
                <TabButton tabName="simulation-controls" />
                <TabButton tabName="color-controls" />
              </Tabs.List>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
