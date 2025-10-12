import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../../stores/useSlimeStore";

export default function TimeOffsetListener() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);

  useEffect(() => {
    const timeOffsetTotal =
      clockSettings.timeOffsetMinutesOnly * 60 * 1000 +
      clockSettings.timeOffsetSecondsOnly * 1000 +
      clockSettings.timeOffsetMsOnly;

    if (timeOffsetTotal !== clockSettings.timeOffsetTotal) {
      useSlimeStore.setState(
        produce((state) => {
          state.clockSettings.timeOffsetTotal = timeOffsetTotal;
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clockSettings.timeOffsetMinutesOnly,
    clockSettings.timeOffsetSecondsOnly,
    clockSettings.timeOffsetMsOnly,
  ]);

  return null;
}
