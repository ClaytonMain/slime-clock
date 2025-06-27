import { produce } from "immer";
import { motion } from "motion/react";
import { Tabs } from "radix-ui";
import { type SVGProps } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { ControlsTabName } from "../../types/types";

type SvgPathAttributes = Record<ControlsTabName, SVGProps<SVGPathElement>[]>;

const svgPathAttributes: SvgPathAttributes = {
  "clock-controls": [
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
  ],
  "simulation-controls": [
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "2",
      d: "M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4",
    },
  ],
  "color-controls": [
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M12 7h.01m3.486 1.513h.01m-6.978 0h.01M6.99 12H7m9 4h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 3.043 12.89 9.1 9.1 0 0 0 8.2 20.1a8.62 8.62 0 0 0 3.769.9 2.013 2.013 0 0 0 2.03-2v-.857A2.036 2.036 0 0 1 16 16Z",
    },
  ],
};

function getSvgPaths(name: ControlsTabName) {
  const pathAttributes = svgPathAttributes[name];
  return (
    <>
      {pathAttributes.map((attributes, index) => (
        <path key={`${name}-path-${index}`} {...attributes} />
      ))}
    </>
  );
}

export default function TabButton({ tabName }: { tabName: ControlsTabName }) {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  function handleTabChange(value: ControlsTabName) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.selectedTab = value;
      }),
    );
  }

  return (
    <Tabs.Trigger value={tabName} onClick={() => handleTabChange(tabName)}>
      <motion.div
        className="flex cursor-pointer flex-col items-center rounded-full"
        animate={{
          backgroundColor:
            selectedTab === tabName
              ? "var(--color-tab-button-hover-background)"
              : "var(--color-tab-button-background)",
        }}
      >
        <svg
          className="text-tooltip-text h-12 w-12 rounded-full px-2 py-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          {getSvgPaths(tabName)}
        </svg>
      </motion.div>
    </Tabs.Trigger>
  );
}
