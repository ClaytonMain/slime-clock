import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import "./App.css";
import SlimeClockScene from "./SlimeClock/SlimeClockScene";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider attribute="class">
      <Theme>
        <SlimeClockScene />
        <Footer />
      </Theme>
    </ThemeProvider>
  );
}

export default App;
