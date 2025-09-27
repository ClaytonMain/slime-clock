import { produce } from "immer";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ANIMATION_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import DivCornerPlusIcon from "../controls/DivCornerPlusIcon";
import DivDashedEdge from "../controls/DivDashedEdge";

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
            key={"framerate-gauge-display-outer-container"}
            initial={{ opacity: 0 }}
            animate={{
              opacity: ANIMATION_CONFIGS.flickerIn.opacity,
              transition: {
                duration: 0.4,
                times: ANIMATION_CONFIGS.flickerIn.transition.times,
              },
            }}
            exit={{
              opacity: ANIMATION_CONFIGS.flickerOut.opacity,
              transition: {
                duration: 0.4,
                delay: 0.3,
                times: ANIMATION_CONFIGS.flickerOut.transition.times,
              },
            }}
            className="absolute top-0 left-0 flex items-center justify-center bg-slate-950"
          >
            <div className="fixed top-1/2 left-1/2 flex w-sm -translate-1/2 flex-col items-center bg-slate-900/60 px-4 py-2 text-sm text-sky-50">
              {Array.from({ length: 4 }).map((_, index) => (
                <>
                  <DivCornerPlusIcon
                    key={`framerate-gauge-corner-plus-icon-${index}`}
                    index={index}
                  />
                  <DivDashedEdge
                    key={`framerate-gauge-dashed-edge-${index}`}
                    index={index}
                  />
                </>
              ))}
              <div className="w-2/3 text-center text-[1.0rem]">
                Adjusting resolution based on device performance...
              </div>
              <div className="mt-1 flex w-full flex-row items-baseline justify-center text-white/80 italic">
                <p className="flex w-full grow justify-end text-3xl">{`${Math.floor(timeRemaining)}`}</p>
                <p className="flex-none text-xs">.</p>
                <p className="flex w-full grow text-xs">{`${timeRemaining.toFixed(3).replace(/\d+\./, "")}`}</p>
              </div>
              <button
                onClick={skipFramerateGauge}
                className="mt-2 w-2/3 cursor-pointer rounded bg-sky-700/80 px-2 py-1 text-xs hover:bg-sky-600/100 active:scale-95"
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
