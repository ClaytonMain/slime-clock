import { ThemeProvider } from "next-themes";
import "./App.css";
import Footer from "./components/footer/Footer";
import SlimeClockScene from "./components/slime-clock/SlimeClockScene";

function App() {
  return (
    <ThemeProvider attribute="class">
      <SlimeClockScene />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
