import { produce } from "immer";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useRatingsStore from "../../stores/useRatingsStore";
import useSlimeStore from "../../stores/useSlimeStore";

const defaultRatingsAndCategorization = {
  timestamp: Date.now(),
  simulationSettings: useSlimeStore.getState().simulationSettings,
  overallRating: 0,
  doesItFeelSlimy: false,
  clockLegibility: 0,
  fuzziness: 0,
  agentCohesion: 0,
  clockCoverage: 0,
  backgroundCoverage: 0,
  tendrilSize: 0,
  clusterSize: 0,
  clusterDistance: 0,
  griddiness: 0,
};
export default function RatingsAndCategorizationControl() {
  const simulationSettings = useSlimeStore((state) => state.simulationSettings);
  const [ratingsAndCategorization, setRatingsAndCategorization] = useState(
    defaultRatingsAndCategorization,
  );
  function updateRatingsAndCategorization<
    T extends keyof typeof defaultRatingsAndCategorization,
  >(key: T, value: (typeof defaultRatingsAndCategorization)[T]) {
    setRatingsAndCategorization((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
  useEffect(() => {
    setRatingsAndCategorization((prev) => ({
      ...prev,
      simulationSettings,
    }));
  }, [simulationSettings]);
  function appendToRatingsHistory() {
    useRatingsStore.setState(
      produce((state) => {
        state.ratingsHistory = [
          ...state.ratingsHistory,
          {
            ...ratingsAndCategorization,
            timestamp: Date.now(),
          },
        ];
      }),
    );
    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Success!";
        state.toast.description =
          "Ratings and categorization data saved successfully!";
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
    setRatingsAndCategorization(defaultRatingsAndCategorization);
  }
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-overall-rating"
        >
          Overall Rating
        </label>
        <span className="w-7">{ratingsAndCategorization.overallRating}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-overall-rating"
          value={ratingsAndCategorization.overallRating}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "overallRating",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-does-it-feel-slimy"
        >
          Does it feel slimy?
        </label>
        <span className="w-7">
          {ratingsAndCategorization.doesItFeelSlimy ? "Yes" : "No"}
        </span>
        <input
          type="checkbox"
          id="ratings-and-categorization-does-it-feel-slimy"
          checked={ratingsAndCategorization.doesItFeelSlimy}
          onChange={(e) =>
            updateRatingsAndCategorization("doesItFeelSlimy", e.target.checked)
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-clock-legibility"
        >
          Clock Legibility
        </label>
        <span className="w-7">{ratingsAndCategorization.clockLegibility}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-clock-legibility"
          value={ratingsAndCategorization.clockLegibility}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "clockLegibility",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-fuzziness"
        >
          Fuzziness
        </label>
        <span className="w-7">{ratingsAndCategorization.fuzziness}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-fuzziness"
          value={ratingsAndCategorization.fuzziness}
          onChange={(e) =>
            updateRatingsAndCategorization("fuzziness", Number(e.target.value))
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-agent-cohesion"
        >
          Agent Cohesion
        </label>
        <span className="w-7">{ratingsAndCategorization.agentCohesion}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-agent-cohesion"
          value={ratingsAndCategorization.agentCohesion}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "agentCohesion",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-clock-coverage"
        >
          Clock Coverage
        </label>
        <span className="w-7">{ratingsAndCategorization.clockCoverage}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-clock-coverage"
          value={ratingsAndCategorization.clockCoverage}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "clockCoverage",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-background-coverage"
        >
          Background Coverage
        </label>
        <span className="w-7">
          {ratingsAndCategorization.backgroundCoverage}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-background-coverage"
          value={ratingsAndCategorization.backgroundCoverage}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "backgroundCoverage",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-tendril-size"
        >
          Tendril Size
        </label>
        <span className="w-7">{ratingsAndCategorization.tendrilSize}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-tendril-size"
          value={ratingsAndCategorization.tendrilSize}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "tendrilSize",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-cluster-size"
        >
          Cluster Size
        </label>
        <span className="w-7">{ratingsAndCategorization.clusterSize}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-cluster-size"
          value={ratingsAndCategorization.clusterSize}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "clusterSize",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-cluster-distance"
        >
          Cluster Distance
        </label>
        <span className="w-7">{ratingsAndCategorization.clusterDistance}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-cluster-distance"
          value={ratingsAndCategorization.clusterDistance}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "clusterDistance",
              Number(e.target.value),
            )
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-griddiness"
        >
          Griddiness
        </label>
        <span className="w-7">{ratingsAndCategorization.griddiness}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-griddiness"
          value={ratingsAndCategorization.griddiness}
          onChange={(e) =>
            updateRatingsAndCategorization("griddiness", Number(e.target.value))
          }
        />
      </div>
      <div className="flex w-full gap-1 p-2">
        <motion.button
          className="border border-sky-800 bg-zinc-800 p-2"
          onClick={appendToRatingsHistory}
          whileHover={{ cursor: "pointer" }}
          whileTap={{ scale: 0.95 }}
        >
          Save Ratings & Categorization
        </motion.button>
      </div>
    </div>
  );
}
