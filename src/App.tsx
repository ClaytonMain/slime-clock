// import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
// import "./App.css";
// import Footer from "./components/footer/Footer";
import Controls from "./components/controls/Controls";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";

function App() {
  return (
    <div className="top-0 left-0 m-0 h-full w-full overflow-hidden p-0">
      {/* <Theme> */}
      <SlimeClockScene />
      {/* <Footer /> */}
      <Controls />
      {/* <ThemePanel /> */}
      {/* </Theme> */}
    </div>
  );
}

export default App;
