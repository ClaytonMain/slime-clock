import "@radix-ui/themes/styles.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import AutomaticTimeOffsetSync from "./AutomaticTimeOffsetSync";
import Controls from "./components/controls/Controls";
import FramerateGaugeDisplay from "./components/slime-clock/FramerateGaugeDisplay";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";
import FullscreenHandleComponent from "./FullscreenHandleComponent";
import LayoutListener from "./LayoutListener";
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
          {framerateGaugedPreviously && <Controls />}
          <ToastProvider />
          <FramerateGaugeDisplay />
        </div>
      </FullScreen>
      <LayoutListener />
      <AutomaticTimeOffsetSync />
    </>
  );
}

export default App;
