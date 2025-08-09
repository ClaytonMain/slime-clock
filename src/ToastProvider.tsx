import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ANIMATION_CONFIGS } from "./constants/constants";
import useSlimeStore from "./stores/useSlimeStore";

export default function ToastProvider() {
  const toastState = useSlimeStore((state) => state.toast);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (toastState.lastTriggeredAt === 0) return;
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  }, [toastState.lastTriggeredAt]);

  useEffect(() => {
    if (!open) return;
    const timeoutId = setTimeout(() => {
      setOpen(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed right-0 bottom-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]"
          initial={{ opacity: 0 }}
          animate={{
            ...ANIMATION_CONFIGS.flickerIn,
          }}
          exit={{ ...ANIMATION_CONFIGS.flickerOut }}
        >
          <div className="flex items-center justify-between border border-dashed border-sky-50 bg-zinc-950/60 p-4 text-white shadow-lg">
            <div>
              <div className="font-semibold">{toastState.title}</div>
              <div className="text-sm">{toastState.description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
