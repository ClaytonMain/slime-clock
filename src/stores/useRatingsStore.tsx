import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SimulationSettings } from "../types/types";

interface RatingsStore {
  ratingHistory: {
    timestamp: number;
    simulationSettings: SimulationSettings;
    overallRating: number;
    doesItFeelSlimy: boolean;
    clockLegibility: number;
    fuzziness: number;
    agentCohesion: number;
    clockCoverage: number;
    backgroundCoverage: number;
    tendrilSize: number;
    clusterSize: number;
    clusterDistance: number;
    griddiness: number;
  }[];
}

const useRatingsStore = create<RatingsStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set) => ({
      ratingHistory: [],
    }),
    {
      name: "ratings-storage",
      version: 0,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useRatingsStore;
