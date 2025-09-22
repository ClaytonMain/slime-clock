import { produce } from "immer";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ButtonControlGroup from "./ButtonControlGroup";
import RatingsAndCategorizationControl from "./RatingsAndCategorizationControl";
import SlimeStoreSwitchControl from "./SlimeStoreSwitchControl";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function DebugControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  const debugControlsDefaultLabelHoverTabContentDisplay = [
    "Debug Controls",
    "Hey! You shouldn't be here! Unless you're me... Hmm.........",
  ];

  useEffect(() => {
    if (selectedTab === "debug-controls") {
      useSlimeStore.setState(
        produce((state) => {
          state.controlsState.displayAreaHtmlContent =
            debugControlsDefaultLabelHoverTabContentDisplay;
          state.controlsState.displayAreaContentName = null;
          state.controlsState.hideDisplayAreaBackground = false;
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  function deleteSlimeStorageAndRefresh() {
    localStorage.removeItem("slime-storage");
    window.location.reload();
  }

  return (
    <TabContentContainer tabsValue="debug-controls">
      <TabContentScrollArea title="Debug">
        <AccordionControlsWrapper
          accordionId="debug-controls-accordion"
          type="multiple"
          defaultValue={["ratings-and-categorization", "debug-settings"]}
        >
          <AccordionControlsItem
            value="ratings-and-categorization"
            label="Ratings & Categorization"
          >
            <RatingsAndCategorizationControl />
          </AccordionControlsItem>
          <AccordionControlsItem
            value="debug-settings"
            label="Debug Settings"
            labelHoverTabContentDisplay={
              debugControlsDefaultLabelHoverTabContentDisplay
            }
          >
            <SlimeStoreSwitchControl
              label="Enable 'debug' in Store"
              baseId="debug-controls-enable-debug-switch"
              storePath={["debug"]}
              labelHoverTabContentDisplay={[
                "Enable 'debug' in Store",
                "Toggle the 'debug' flag in the global store. Currently only affects logging.",
              ]}
            />
            <SlimeStoreSwitchControl
              label="Show GPU Textures"
              baseId="debug-controls-show-gpu-textures-switch"
              storePath={["simulationSettings", "showTextureDisplayPlanes"]}
              labelHoverTabContentDisplay={[
                "Show GPU Textures",
                "Probably does something. Maybe. Toggle it and find out. I dare you.",
              ]}
            />
            <ButtonControlGroup
              label="Reset Storage & Refresh"
              labelHoverTabContentDisplay={[
                "Reset Storage & Refresh",
                <div className="px-2 py-1">
                  <strong className="text-red-600">
                    !!! WARNING WARNING WARNING !!!
                  </strong>
                  <br />
                  <strong className="text-red-600">
                    This action is irreversible!
                  </strong>
                  <br />
                  <strong className="text-red-600">
                    Do not click on this button unless you know what you are
                    doing.
                  </strong>
                  <br />
                  <strong className="text-red-600">
                    There is NO confirmation prompt!
                  </strong>
                  <br />
                  Deletes the 'slime-storage' entry in localStorage and
                  refreshes the page. This will reset all settings to default{" "}
                  <strong className="text-red-600">
                    AND DELETE ANY SAVED PRESETS
                  </strong>
                  . Oh, and your history too. Everything.
                </div>,
              ]}
              buttonConfigs={[
                {
                  label: "💀Reset & Refresh💀No Confirmation Prompt💀",
                  onClick: deleteSlimeStorageAndRefresh,
                  color: "danger",
                },
              ]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
