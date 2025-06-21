import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

export default function ControlContainer({
  children,
  label,
  collapsible = true,
  collapsed = true,
}: {
  children: ReactNode;
  label?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(!collapsed);

  return (
    <div className="bg-control-container-background-b/80 text-control-container-text mb-1 flex flex-col rounded-sm p-2">
      {(collapsible || label) && (
        <motion.div
          className="flex items-center p-1"
          whileHover={{ cursor: collapsible ? "pointer" : "default" }}
          onClick={() => {
            if (collapsible) {
              setIsOpen(!isOpen);
            }
          }}
        >
          {collapsible && (
            <motion.svg
              className="me-1 flex h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <motion.path
                animate={{ rotate: isOpen ? 0 : -90 }}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </motion.svg>
          )}
          {label && (
            <motion.label
              className="text-light-text text-sm font-medium"
              whileHover={{
                cursor: collapsible ? "pointer" : "default",
              }}
            >
              {label}
            </motion.label>
          )}
        </motion.div>
      )}
      <AnimatePresence mode="wait">
        {((collapsible && isOpen) || !collapsible) && (
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
