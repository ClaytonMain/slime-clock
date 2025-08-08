import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "./stores/useSlimeStore";
import { getSortedPresets } from "./utils/utils";

export default function PresetsChangeListener() {
  const presets = useSlimeStore((state) => state.presets);

  useEffect(() => {
    useSlimeStore.setState(
      produce((state) => {
        state.sortedPresets = getSortedPresets(presets);
      }),
    );
  }, [presets]);

  return null;
}
