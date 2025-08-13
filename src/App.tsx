import "@radix-ui/themes/styles.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Controls from "./components/controls/Controls";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";
import FullscreenHandleComponent from "./FullscreenHandleComponent";
import ToastProvider from "./ToastProvider";

function App() {
  const handle = useFullScreenHandle();
  return (
    <>
      <FullscreenHandleComponent handle={handle} />
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
