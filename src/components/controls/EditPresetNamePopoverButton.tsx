import { motion } from "motion/react";
import { Popover } from "radix-ui";
import { useState, type ChangeEvent } from "react";
import { PiNotePencil } from "react-icons/pi";
import useSlimeStore from "../../stores/useSlimeStore";
import TooltipWrapper from "./TooltipWrapper";

export default function EditPresetNamePopoverButton({
  oldName,
  onSave,
}: {
  oldName: string;
  onSave: (newName: string) => boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const portalContainer = useSlimeStore((state) => state.portalContainer);
  const [presetName, setPresetName] = useState<string>(oldName);

  function onChangePresetNameInput(e: ChangeEvent<HTMLInputElement>) {
    setPresetName(e.currentTarget.value.replace(/\s\s+/g, " "));
  }

  function handleOnSave() {
    const trimmedPresetName = presetName.trim();
    if (trimmedPresetName.length === 0) return;
    if (trimmedPresetName === oldName) {
      setOpen(false);
      return;
    }
    setPresetName(trimmedPresetName);
    const success = onSave(trimmedPresetName);
    if (success) {
      setOpen(false);
    }
  }

  function handleKeyUp(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleOnSave();
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <TooltipWrapper tooltipText="Edit Name">
        <Popover.Trigger asChild>
          <motion.button
            className="flex h-7 w-7 cursor-pointer flex-col items-center justify-center border border-sky-800 p-1"
            style={{ backgroundColor: "#18181b" }}
            whileHover={{ backgroundColor: "#27272a" }}
          >
            <motion.div
              className="relative"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.05 }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
                // animate={{ opacity: copyState === "ready" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <PiNotePencil className="h-full w-full scale-[0.9]" />
              </motion.div>
            </motion.div>
          </motion.button>
        </Popover.Trigger>
      </TooltipWrapper>
      <Popover.Portal container={portalContainer}>
        <Popover.Content align="start" alignOffset={-20}>
          <div className="flex flex-col gap-2 bg-zinc-800 p-2 text-sm text-sky-50">
            <div className="flex items-center gap-2">
              <label htmlFor={`save-as-preset-name-${oldName}`}>
                Preset Name:
              </label>
              <input
                className="border border-sky-800 bg-zinc-700 p-1"
                type="text"
                id={`save-as-preset-name-${oldName}`}
                value={presetName}
                onChange={onChangePresetNameInput}
                maxLength={30}
                size={20}
                onKeyUp={handleKeyUp}
              />
            </div>
            <div className="flex justify-center gap-1">
              <motion.button
                className="flex cursor-pointer border border-sky-800 px-2 py-1"
                style={{ backgroundColor: "#18181b" }}
                whileHover={{ backgroundColor: "#27272a" }}
                onClick={handleOnSave}
              >
                Save Name
              </motion.button>
              <motion.button
                className="flex cursor-pointer border border-sky-800 px-2 py-1"
                style={{ backgroundColor: "#18181b" }}
                whileHover={{ backgroundColor: "#27272a" }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </motion.button>
            </div>
          </div>
          <Popover.Arrow className="fill-zinc-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
