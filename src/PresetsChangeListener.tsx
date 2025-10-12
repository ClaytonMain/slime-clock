import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "./stores/useSlimeStore";
import { getSortedSimulationPresets } from "./utils/utils";

export default function SimulationPresetsChangeListener() {
  const simulationPresets = useSlimeStore((state) => state.simulationPresets);

  useEffect(() => {
    useSlimeStore.setState(
      produce((state) => {
        state.sortedSimulationPresets =
          getSortedSimulationPresets(simulationPresets);
      }),
    );
  }, [simulationPresets]);

  return null;
}
