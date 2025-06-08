import SlimeStoreColorPicker from "../slime-store-color-picker/SlimeStoreColorPicker";
import FooterTabContent from "./FooterTabContent";

export default function ColorSettings() {
  // const colorSettings = useSlimeStore((state) => state.simulationSettings);

  return (
    <FooterTabContent tabName="simulation-settings" key="simulation-settings">
      <div className="mx-auto flex h-auto w-full max-w-sm flex-col bg-amber-200 p-1">
        <SlimeStoreColorPicker
          label="Background Color"
          storePath={["simulationSettings", "backgroundColor"]}
        />
      </div>
    </FooterTabContent>
  );
}
