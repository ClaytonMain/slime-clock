import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Controls from "./components/controls/Controls";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";

function App() {
  const handle = useFullScreenHandle();
  return (
    <>
      <EnterFullScreenIcon
        className="absolute top-4 right-4 z-50 cursor-pointer bg-zinc-950 text-sky-50"
        style={{ width: "2rem", height: "2rem" }}
        onClick={handle.enter}
        aria-label="Enter Fullscreen"
        role="button"
        tabIndex={0}
      />
      <FullScreen handle={handle}>
        <div className="top-0 left-0 m-0 h-full w-full overflow-hidden p-0">
          <SlimeClockScene />
          <Controls />
        </div>
      </FullScreen>
    </>
  );
}

export default App;
