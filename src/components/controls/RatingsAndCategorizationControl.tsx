import { produce } from "immer";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useRatingsStore from "../../stores/useRatingsStore";
import useSlimeStore from "../../stores/useSlimeStore";

const defaultRatingsAndCategorization = {
  timestamp: Date.now(),
  simulationSettings: useSlimeStore.getState().simulationSettings,
  overallRating: -1,
  sliminess: -1,
  clockLegibility: -1,
  fuzziness: -1,
  agentCohesion: -1,
  clockCoverage: -1,
  backgroundCoverage: -1,
  tendrilThickness: -1,
  tendrilLength: -1,
  waviness: -1,
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
  function appendToRatingHistory() {
    useRatingsStore.setState(
      produce((state) => {
        state.ratingHistory = [
          ...state.ratingHistory,
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
    console.log(
      "Saved ratings and categorization data.",
      useRatingsStore.getState().ratingHistory,
    );
  }
  function copyRatingsAndCategorizationToClipboard(
    format: "json" | "csv" | "sheets",
  ) {
    const ratingHistory = useRatingsStore.getState().ratingHistory;
    if (!ratingHistory || ratingHistory.length === 0) {
      useSlimeStore.setState(
        produce((state) => {
          state.toast.title = "Error";
          state.toast.description = "No rating history available to copy.";
          state.toast.type = "error";
          state.toast.lastTriggeredAt = Date.now();
        }),
      );
      return;
    }
    if (format === "json") {
      navigator.clipboard.writeText(JSON.stringify(ratingHistory));
    } else {
      const headers: string[] = [];
      const valuesObjects: { [key: string]: string | number }[] = [];
      ratingHistory.forEach((entry) => {
        const valuesObject: { [key: string]: string | number } = {};
        Object.entries(entry).forEach(([key, value]) => {
          if (key === "simulationSettings") return;
          // @ts-expect-error this is fine.
          valuesObject[key] = value;
          if (!headers.includes(key)) {
            headers.push(key);
          }
        });
        Object.entries(entry.simulationSettings).forEach(([key, value]) => {
          valuesObject[`simulationSettings.${key}`] = value;
          if (!headers.includes(`simulationSettings.${key}`)) {
            headers.push(`simulationSettings.${key}`);
          }
        });
        valuesObjects.push(valuesObject);
      });

      const values: (string | number)[][] = [[...headers]];
      valuesObjects.forEach((valuesObject) => {
        const row: (string | number)[] = [];
        headers.forEach((header) => {
          const pushVal = valuesObject[header];
          if (
            pushVal === undefined ||
            (Object.keys(defaultRatingsAndCategorization).includes(header) &&
              pushVal === -1)
          ) {
            row.push("");
          } else {
            row.push(pushVal);
          }
        });
        values.push(row);
      });

      const csvContent = values
        .map((row) =>
          row
            .map((value) => {
              if (typeof value === "string") {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            })
            .join(format === "csv" ? ", " : "\t"),
        )
        .join("\r\n");
      navigator.clipboard.writeText(csvContent);
    }

    useSlimeStore.setState(
      produce((state) => {
        state.toast.title = "Success!";
        state.toast.description =
          "Ratings and categorization data copied to clipboard!";
        state.toast.type = "success";
        state.toast.lastTriggeredAt = Date.now();
      }),
    );
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
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("overallRating", -1)}
        >
          Reset
        </button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-sliminess"
        >
          Sliminess
        </label>
        <span className="w-7">{ratingsAndCategorization.sliminess}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-sliminess"
          value={ratingsAndCategorization.sliminess}
          onChange={(e) =>
            updateRatingsAndCategorization("sliminess", Number(e.target.value))
          }
        />
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("sliminess", -1)}
        >
          Reset
        </button>
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
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("clockLegibility", -1)}
        >
          Reset
        </button>
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
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("fuzziness", -1)}
        >
          Reset
        </button>
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
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("agentCohesion", -1)}
        >
          Reset
        </button>
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
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("clockCoverage", -1)}
        >
          Reset
        </button>
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
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() =>
            updateRatingsAndCategorization("backgroundCoverage", -1)
          }
        >
          Reset
        </button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-tendril-thickness"
        >
          Tendril Thickness
        </label>
        <span className="w-7">{ratingsAndCategorization.tendrilThickness}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          id="ratings-and-categorization-tendril-thickness"
          value={ratingsAndCategorization.tendrilThickness}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "tendrilThickness",
              Number(e.target.value),
            )
          }
        />
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("tendrilThickness", -1)}
        >
          Reset
        </button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-tendril-length"
        >
          Tendril Length
        </label>
        <span className="w-7">{ratingsAndCategorization.tendrilLength}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          id="ratings-and-categorization-tendril-length"
          value={ratingsAndCategorization.tendrilLength}
          onChange={(e) =>
            updateRatingsAndCategorization(
              "tendrilLength",
              Number(e.target.value),
            )
          }
        />
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("tendrilLength", -1)}
        >
          Reset
        </button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <label
          className="w-32 flex-none"
          htmlFor="ratings-and-categorization-waviness"
        >
          Waviness
        </label>
        <span className="w-7">{ratingsAndCategorization.waviness}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          id="ratings-and-categorization-waviness"
          value={ratingsAndCategorization.waviness}
          onChange={(e) =>
            updateRatingsAndCategorization("waviness", Number(e.target.value))
          }
        />
        <button
          className="cursor-pointer border border-sky-800 bg-zinc-800 p-1"
          onClick={() => updateRatingsAndCategorization("waviness", -1)}
        >
          Reset
        </button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <motion.button
          className="border border-sky-800 bg-zinc-800 p-2"
          onClick={appendToRatingHistory}
          whileHover={{ cursor: "pointer" }}
          whileTap={{ scale: 0.95 }}
        >
          Save Ratings & Categorization
        </motion.button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <motion.button
          className="border border-sky-800 bg-zinc-800 p-2"
          onClick={() => copyRatingsAndCategorizationToClipboard("json")}
          whileHover={{ cursor: "pointer" }}
          whileTap={{ scale: 0.95 }}
        >
          Copy Ratings & Categorization to Clipboard (as JSON)
        </motion.button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <motion.button
          className="border border-sky-800 bg-zinc-800 p-2"
          onClick={() => copyRatingsAndCategorizationToClipboard("csv")}
          whileHover={{ cursor: "pointer" }}
          whileTap={{ scale: 0.95 }}
        >
          Copy Ratings & Categorization to Clipboard (as CSV)
        </motion.button>
      </div>
      <div className="flex w-full gap-1 p-2">
        <motion.button
          className="border border-sky-800 bg-zinc-800 p-2"
          onClick={() => copyRatingsAndCategorizationToClipboard("sheets")}
          whileHover={{ cursor: "pointer" }}
          whileTap={{ scale: 0.95 }}
        >
          Copy Ratings & Categorization to Clipboard (as Sheets-Compatible)
        </motion.button>
      </div>
    </div>
  );
}
