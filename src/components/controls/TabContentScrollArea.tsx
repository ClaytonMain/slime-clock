import { AnimatePresence, motion } from "motion/react";
import { ScrollArea } from "radix-ui";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";

export default function TabContentScrollArea({
  title,
  titleFontSize = "1.5rem",
  children,
  childrenPadding,
}: {
  title?: ReactNode;
  titleFontSize?: string;
  children?: ReactNode;
  childrenPadding?: string[];
}) {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [scrollbarIsVisible, setScrollbarIsVisible] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!scrollbarRef.current) {
        setScrollbarIsVisible(false);
      } else {
        if (scrollbarRef.current.dataset.state === "visible") {
          setScrollbarIsVisible(true);
        } else {
          setScrollbarIsVisible(false);
        }
      }
    }, 100);
    return () => clearInterval(timerId);
  }, []);

  return (
    <motion.div
      className="flex h-full grow flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={ANIMATION_CONFIGS.flickerIn}
      exit={ANIMATION_CONFIGS.flickerOut}
      transition={{ delay: Math.random() * 0.1 + 0.3 }}
    >
      {title && (
        <div
          style={{ fontSize: titleFontSize }}
          className="font-display w-full flex-none bg-zinc-950/80 py-1 text-center text-sky-300 select-none"
        >
          {title}
        </div>
      )}
      <ScrollArea.Root
        key="scroll-area-root"
        className="h-0 grow overflow-hidden bg-zinc-900/80"
      >
        <ScrollArea.Viewport
          key="scroll-area-viewport"
          className={
            "flex size-full flex-col text-sm text-sky-50" +
            (childrenPadding ? ` ${childrenPadding.join(" ")}` : "")
          }
        >
          {children}
        </ScrollArea.Viewport>
        <AnimatePresence>
          <ScrollArea.Scrollbar
            key="scroll-area-scrollbar-radix"
            className="z-[3] flex w-2.5 touch-none bg-zinc-950 p-0.5 select-none"
            orientation="vertical"
            asChild
            forceMount
          >
            <motion.div
              ref={scrollbarRef}
              onViewportEnter={() => setScrollbarIsVisible(true)}
              key="scroll-area-scrollbar-motion"
              initial={{ opacity: 0 }}
              animate={
                scrollbarIsVisible
                  ? ANIMATION_CONFIGS.flickerIn
                  : ANIMATION_CONFIGS.flickerOut
              }
              exit={ANIMATION_CONFIGS.flickerOut}
            >
              <ScrollArea.Thumb
                key="scroll-area-thumb"
                className="relative flex-1 rounded-lg bg-sky-600 before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2"
              />
            </motion.div>
          </ScrollArea.Scrollbar>
        </AnimatePresence>
      </ScrollArea.Root>
    </motion.div>
  );
}
