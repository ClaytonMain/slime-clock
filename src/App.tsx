import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";
import { motion } from "framer-motion";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Controls from "./components/controls/Controls";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";
import ToastProvider from "./ToastProvider";

function App() {
  const handle = useFullScreenHandle();
  return (
    <>
      <motion.div
        className="absolute top-4 right-4 z-50 cursor-pointer appearance-none p-0.5 text-sky-50"
        animate={{
          backgroundColor: "var(--color-zinc-950-60)",
        }}
        whileHover={{
          backgroundColor: "var(--color-sky-950-60)",
        }}
        onClick={handle.enter}
        aria-label="Enter Fullscreen"
        role="button"
        tabIndex={0}
      >
        <EnterFullScreenIcon className="h-6 w-6" />
      </motion.div>
      <FullScreen handle={handle}>
        <div className="top-0 left-0 m-0 h-full w-full overflow-hidden p-0">
          <SlimeClockScene />
          <Controls />
          <ToastProvider />
        </div>
      </FullScreen>
    </>
  );
}

export default App;
