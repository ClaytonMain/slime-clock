// import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
// import "./App.css";
// import Footer from "./components/footer/Footer";
import Controls from "./components/controls/Controls";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";

function App() {
  return (
    <>
      {/* <Theme> */}
      <SlimeClockScene />
      {/* <Footer /> */}
      <Controls />
      {/* <ThemePanel /> */}
      {/* </Theme> */}
    </>
  );
}

export default App;
