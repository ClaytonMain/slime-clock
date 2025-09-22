import "@radix-ui/themes/styles.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Controls from "./components/controls/Controls";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";
import FullscreenHandleComponent from "./FullscreenHandleComponent";
import useSlimeStore from "./stores/useSlimeStore";
import ToastProvider from "./ToastProvider";

function App() {
  const handle = useFullScreenHandle();
  const framerateGaugedPreviously = useSlimeStore(
    (state) => state.framerateGaugedPreviously,
  );
  return (
    <>
      <FullscreenHandleComponent handle={handle} />
      <FullScreen handle={handle}>
        <div className="top-0 left-0 m-0 h-full w-full overflow-hidden p-0">
          <SlimeClockScene />
          <Controls />
          <ToastProvider />
          {!framerateGaugedPreviously && (
            <div className="pointer-events-none absolute top-0 left-0 flex h-full w-full items-center justify-center">
              <div className="animate-pulse rounded-md bg-black/60 px-4 py-2 text-center text-sm text-white">
                Gauging performance...
              </div>
            </div>
          )}
        </div>
      </FullScreen>
    </>
  );
}

export default App;
