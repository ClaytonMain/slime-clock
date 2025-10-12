import { useEffect } from "react";
import useSlimeStore from "./stores/useSlimeStore";
import * as UTILS from "./utils/utils.tsx";

export default function AutomaticTimeOffsetSync() {
  const syncTimeOffsetsAutomatically = useSlimeStore(
    (state) => state.clockSettings.syncTimeOffsetsAutomatically,
  );

  useEffect(() => {
    const automaticTimeOffsetRequestedAt =
      useSlimeStore.getState().clockSettings.automaticTimeOffsetRequestedAt;
    if (
      syncTimeOffsetsAutomatically &&
      Date.now() - automaticTimeOffsetRequestedAt > 60 * 1000
    ) {
      UTILS.requestAutomaticTimeOffsetSet(false);
    }
    const intervalId = setInterval(
      () => {
        if (syncTimeOffsetsAutomatically) {
          UTILS.requestAutomaticTimeOffsetSet(false);
        }
      },
      12 * 60 * 60 * 1000,
    );
    return () => clearInterval(intervalId);
  }, [syncTimeOffsetsAutomatically]);

  return null;
}
