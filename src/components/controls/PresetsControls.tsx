import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup.tsx";
import SettingsLoadSaveControl from "./SettingsLoadSaveControl.tsx";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function PresetsControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  const history = useSlimeStore((state) => state.history);

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
          defaultValue={["quick-settings"]}
        >
          <AccordionControlsItem
            value="quick-settings"
            label="Quick Settings"
            labelHoverTabContentDisplay={[
              "Quick Settings",
              <div className="px-2 py-1">
                <ul className="list-inside list-disc">
                  <li>Gleep glorp</li>
                </ul>
              </div>,
            ]}
          >
            <ButtonControlGroup
              label="Quick Actions"
              labelHoverTabContentDisplay={["Quick Actions"]}
              buttonConfigs={[
                {
                  label: "(disabled) Save All as Preset",
                  baseId: "save-all-as-preset-button",
                  onClick: () => {
                    // Implement save preset logic here
                  },
                },
                {
                  label: "(disabled) Save Sim. Settings as Preset",
                  baseId: "save-simulation-settings-as-preset-button",
                  onClick: () => null,
                },
                {
                  label: "(disabled) Save Color Settings as Preset",
                  baseId: "save-color-settings-as-preset-button",
                  onClick: () => {
                    // Implement save preset logic here
                  },
                },
              ]}
            />
          </AccordionControlsItem>

          <AccordionControlsItem
            value="history"
            label="History"
            labelHoverTabContentDisplay={[]}
          >
            {history.map((entry) => (
              <SettingsLoadSaveControl
                key={entry.timestamp}
                label={entry.timestamp}
                labelHoverTabContentDisplay={[
                  entry.timestamp,
                  <pre className="px-2 py-1 text-[0.6rem] whitespace-pre-wrap">
                    {JSON.stringify(entry, null, 1)}
                  </pre>,
                ]}
                settings={entry}
              />
            ))}
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
