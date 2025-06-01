import { ThemeProvider } from "next-themes";
import "./App.css";
import SlimeClockScene from "./SlimeClock/SlimeClockScene";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider attribute="class">
      <SlimeClockScene />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
