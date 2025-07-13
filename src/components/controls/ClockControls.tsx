import { produce } from "immer";
import { useEffect } from "react";
import { CLOCK_CONTROLS_BOUNDS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type { ClockFormatValue, ClockStyleValue } from "../../types/types";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import SlimeStoreSelect from "./SlimeStoreSelect";
import SlimeStoreSlider from "./SlimeStoreSlider";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

/**
 * Clock Style
 * 7 Segment, Dot Matrix
 */
type ClockStyleOption = {
  value: ClockStyleValue;
  label: string;
};
const clockStyleOptions: ClockStyleOption[] = [
  { value: "7segment", label: "7 Segment" },
  { value: "dotmatrix", label: "Dot Matrix" },
] as const;

/**
 * Clock Format
 * 12 Hour, 24 Hour
 */
type ClockFormatOption = {
  value: ClockFormatValue;
  label: string;
};
const clockFormatOptions: ClockFormatOption[] = [
  { value: "12h", label: "12 Hour" },
  { value: "24h", label: "24 Hour" },
] as const;

export default function ClockControls() {
  const controlsState = useSlimeStore((state) => state.controlsState);

  const clockControlsLabelHoverTabContentDisplay = [
    "Clock",
    "Controls related to the clock display.",
  ];

  useEffect(() => {
    if (controlsState.selectedTab !== "clock-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          clockControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlsState.selectedTab]);

  return (
    <TabContentContainer tabsValue="clock-controls">
      <TabContentScrollArea title="Clock">
        <AccordionControlsWrapper
          type="multiple"
          defaultValue={["clock-settings"]}
        >
          <AccordionControlsItem
            value="clock-settings"
            label="Clock Settings"
            labelHoverTabContentDisplay={
              clockControlsLabelHoverTabContentDisplay
            }
          >
            <SlimeStoreSelect
              label="Style"
              baseInputId="clock-style-select"
              placeholder="Clock Style"
              storePath={["clockSettings", "style"]}
              options={clockStyleOptions}
              labelHoverTabContentDisplay={[
                "Clock Style",
                "Changes the style of the clock display.",
              ]}
            />
            <SlimeStoreSelect
              label="Format"
              baseInputId="clock-format-select"
              placeholder="Clock Format"
              storePath={["clockSettings", "format"]}
              options={clockFormatOptions}
              labelHoverTabContentDisplay={[
                "Clock Format",
                "Changes the format of the clock display.",
              ]}
            />
            <SlimeStoreSlider
              label="Size"
              baseInputId="clock-size-slider"
              min={CLOCK_CONTROLS_BOUNDS.size!.min}
              max={CLOCK_CONTROLS_BOUNDS.size!.max}
              step={1}
              storePath={["clockSettings", "size"]}
              labelHoverTabContentDisplay={[
                "Clock Size",
                <div className="px-2 py-1">
                  Changes the size of the clock display. Values are a percentage
                  of screen space (by height), where
                  <CodeBlock>1</CodeBlock>
                  would be practically invisible,
                  <CodeBlock>50</CodeBlock>
                  would fill half the screen, and
                  <CodeBlock>100</CodeBlock>
                  would fill the entire screen height.
                </div>,
              ]}
            />
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
