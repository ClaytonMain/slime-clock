import { motion } from "motion/react";
import { useState, type SVGProps } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import type { FooterTabName } from "../../types/types";

type SvgPathAttributes = Record<string, SVGProps<SVGPathElement>[]>;

const svgPathAttributes: SvgPathAttributes = {
  "clock-settings": [
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
  ],
  "simulation-settings": [
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeWidth: "2",
      d: "M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4",
    },
  ],
  "color-settings": [
    {
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M12 7h.01m3.486 1.513h.01m-6.978 0h.01M6.99 12H7m9 4h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 3.043 12.89 9.1 9.1 0 0 0 8.2 20.1a8.62 8.62 0 0 0 3.769.9 2.013 2.013 0 0 0 2.03-2v-.857A2.036 2.036 0 0 1 16 16Z",
    },
  ],
};

function getSvgPaths(name: keyof typeof svgPathAttributes) {
  const pathAttributes = svgPathAttributes[name];
  return (
    <>
      {pathAttributes.map((attributes, index) => (
        <path
          key={`${name}-path-${index}`}
          {...attributes}
        />
      ))}
    </>
  );
}

export default function FooterTabButton({
  tabName,
}: {
  tabName: FooterTabName;
}) {
  const [hovered, setHovered] = useState(false);
  const selectedTab = useSlimeStore((state) => state.footerState.selectedTab);
  const footerIsOpen = useSlimeStore((state) => state.footerState.footerIsOpen);
  const openFooterOntoTab = useSlimeStore(
    (state) => state.footerStateOpenFooterOntoTab
  );

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        openFooterOntoTab(tabName);
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col items-center cursor-pointer"
    >
      <motion.svg
        className="w-12 h-12 text-gray-800 dark:text-white mx-1 px-2 py-2 rounded-full"
        animate={{
          backgroundColor: hovered
            ? "var(--color-red-300)"
            : selectedTab === tabName && footerIsOpen
            ? "var(--color-red-500)"
            : "var(--color-red-400)",
        }}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        {getSvgPaths(tabName)}
      </motion.svg>
    </motion.div>
  );
}
