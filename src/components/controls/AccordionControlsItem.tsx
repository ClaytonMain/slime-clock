import { ChevronDownIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { AnimatePresence, motion } from "motion/react";
import { Accordion } from "radix-ui";
import { useEffect, useRef, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function AccordionControlsItem({
  value,
  label,
  labelHoverTabContentDisplay,
  children,
}: {
  value: string;
  label: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  children: ReactNode;
}) {
  const accordionTriggerRef = useRef<HTMLButtonElement>(null);
  const [accordionIsOpen, setAccordionIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!accordionTriggerRef.current) {
        setAccordionIsOpen(false);
      } else {
        if (accordionTriggerRef.current.dataset.state === "open") {
          setAccordionIsOpen(true);
        } else {
          setAccordionIsOpen(false);
        }
      }
    }, 100);
    return () => clearInterval(timerId);
  }, []);

  function handlePointerOver() {
    if (labelHoverTabContentDisplay) {
      useSlimeStore.setState(
        produce((state) => {
          state.controlsState.displayAreaContentName = null;
          state.controlsState.displayAreaHtmlContent =
            labelHoverTabContentDisplay;
          state.controlsState.displayAreaContentType = "html";
        }),
      );
    }
  }

  return (
    <Accordion.Item
      value={value}
      className="overflow-clip focus-within:relative"
    >
      <Accordion.Header className="sticky top-0 z-[2] flex">
        <Accordion.Trigger ref={accordionTriggerRef} asChild>
          <motion.div
            onPointerOver={handlePointerOver}
            className="group flex h-11 flex-1 cursor-pointer items-center justify-between bg-zinc-900 px-5 text-sm leading-none shadow-2xs shadow-zinc-950 outline-none select-none"
          >
            {label}
            <motion.div
              className="flex items-center justify-center"
              animate={{
                rotate: accordionIsOpen ? 180 : 0,
                transition: { duration: 0.6, type: "spring" },
              }}
            >
              <ChevronDownIcon className="text-sky-50" aria-hidden="true" />
            </motion.div>
          </motion.div>
        </Accordion.Trigger>
      </Accordion.Header>
      <AnimatePresence propagate>
        <Accordion.Content key="accordion-content-radix" asChild forceMount>
          <motion.div
            className="flex flex-col overflow-hidden bg-zinc-700 text-sm text-sky-50"
            key="accordion-content-motion"
            initial={{ height: 0 }}
            animate={{
              height: accordionIsOpen ? "auto" : 0,
              transition: { duration: 0.3 },
            }}
            exit={{ height: 0 }}
          >
            {children}
          </motion.div>
        </Accordion.Content>
      </AnimatePresence>
    </Accordion.Item>
  );
}
