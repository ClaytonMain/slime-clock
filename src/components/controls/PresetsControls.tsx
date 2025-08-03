import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import SettingsLoadSaveControl from "./SettingsLoadSaveControl.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function PresetsControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const history = useSlimeStore((state) => state.history);
  const presets = useSlimeStore((state) => state.presets);

  const presetsControlsLabelHoverTabContentDisplay = [
    "Presets Controls",
    "Controls related to presets.",
  ];

  useEffect(() => {
    if (selectedTab !== "presets-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          presetsControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  return (
    <TabContentContainer tabsValue="presets-controls">
      <TabContentScrollArea title="Presets">
        <AccordionControlsWrapper
          type="multiple"
          defaultValue={["presets", "history"]}
        >
          <AccordionControlsItem
            value="presets"
            label="Presets"
            labelHoverTabContentDisplay={[]}
          >
            {presets.map((preset) => (
              <SettingsLoadSaveControl
                key={preset.name}
                label={preset.name}
                labelHoverTabContentDisplay={[
                  preset.name,
                  <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                    {JSON.stringify(preset, null, 1)}
                  </pre>,
                ]}
                settings={preset}
                controlType="presets"
              />
            ))}
          </AccordionControlsItem>

          <AccordionControlsItem
            value="history"
            label="History"
            labelHoverTabContentDisplay={[]}
          >
            {history.map((entry) => (
              <SettingsLoadSaveControl
                key={entry.name}
                label={entry.name}
                labelHoverTabContentDisplay={[
                  entry.name,
                  <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                    {JSON.stringify(entry, null, 1)}
                  </pre>,
                ]}
                settings={entry}
                controlType="history"
              />
            ))}
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
