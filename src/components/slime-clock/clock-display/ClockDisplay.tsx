import useSlimeStore from "../../../stores/useSlimeStore";
import AnalogClockDisplay from "./AnalogClockDisplay";
import DigitalClockDisplay from "./DigitalClockDisplay";

export default function ClockDisplay() {
  const clockSettings = useSlimeStore((state) => state.clockSettings);

  return (
    <>
      {clockSettings.clockStyle === "digital" && <DigitalClockDisplay />}
      {clockSettings.clockStyle === "analog" && <AnalogClockDisplay />}
    </>
  );
}
