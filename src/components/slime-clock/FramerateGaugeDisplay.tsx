import { produce } from "immer";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function FramerateGaugeDisplay() {
  const framerateGaugedPreviously = useSlimeStore(
    (state) => state.framerateGaugedPreviously,
  );
  const framerateGaugeStartedAt = useSlimeStore(
    (state) => state.framerateGaugeStartedAt,
  );
  const [timeRemaining, setTimeRemaining] = useState(10.0);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    timeoutId.current = setInterval(() => {
      if (framerateGaugedPreviously) {
        clearTimeout(timeoutId.current!);
        timeoutId.current = null;
        return;
      }
      if (framerateGaugeStartedAt === 0) return;
      setTimeRemaining(
        Math.min(
          10,
          Math.max(0, (10000 - (Date.now() - framerateGaugeStartedAt)) / 1000),
        ),
      );
    }, 53);
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
  }, [framerateGaugedPreviously, framerateGaugeStartedAt]);

  function skipFramerateGauge() {
    useSlimeStore.setState(
      produce((state) => {
        state.framerateGaugedPreviously = true;
        if (state.framerateGaugeCompletedAt < state.framerateGaugeStartedAt) {
          state.framerateGaugeCompletedAt = Date.now();
        }
      }),
    );
  }

  return (
    <>
      <AnimatePresence>
        {!framerateGaugedPreviously && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-slate-950"
          >
            <div className="flex w-sm animate-pulse flex-col rounded-xs border border-sky-700 bg-slate-900/60 px-4 py-2 text-center text-sm text-sky-50">
              Adjusting resolution based on device performance...
              <div className="mt-1 flex w-full flex-row items-baseline justify-center text-white/80 italic">
                <p className="flex w-full grow justify-end text-3xl">{`${Math.floor(timeRemaining)}`}</p>
                <p className="flex-none text-xs">.</p>
                <p className="flex w-full grow text-xs">{`${timeRemaining.toFixed(3).replace(/\d+\./, "")}`}</p>
              </div>
              <button
                onClick={skipFramerateGauge}
                className="mt-2 cursor-pointer rounded bg-sky-700/80 px-2 py-1 text-xs hover:bg-sky-600/100 active:scale-95"
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
