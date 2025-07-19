import { produce } from "immer";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { CLOCK_CONTROLS_CONFIGS } from "../../constants/constants";
import useSlimeStore from "../../stores/useSlimeStore";
import type {
  ClockDigitStyleValue,
  ClockHourFormatValue,
} from "../../types/types";
import CodeBlock from "../code-block/CodeBlock";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import SlimeStoreSelect from "./SlimeStoreSelect";
import SlimeStoreSlider from "./SlimeStoreSlider";
import SlimeStoreSwitch from "./SlimeStoreSwitch";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

/**
 * Clock Digit Style
 * 7 Segment, Dot Matrix
 */
type ClockDigitStyleOption = {
  value: ClockDigitStyleValue;
  label: string;
};
const clockStyleOptions: ClockDigitStyleOption[] = [
  { value: "7segment", label: "7 Segment" },
  { value: "14segment", label: "14 Segment" },
  { value: "dotmatrix", label: "Dot Matrix" },
  { value: "opticbot", label: "Optic Bot" },
] as const;

/**
 * Clock Hour Format
 * 12 Hour, 24 Hour
 */
type ClockHourFormatOption = {
  value: ClockHourFormatValue;
  label: string;
};
const clockFormatOptions: ClockHourFormatOption[] = [
  { value: "12h", label: "12 Hour" },
  { value: "24h", label: "24 Hour" },
] as const;

export default function ClockControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);
  // const clockHourFormat = useSlimeStore(
  //   (state) => state.clockSettings.hourFormat,
  // );
  const showClock = useSlimeStore((state) => state.clockSettings.show);

  const clockControlsLabelHoverTabContentDisplay = [
    "Clock Controls",
    "Controls related to the clock display.",
  ];

  useEffect(() => {
    if (selectedTab !== "clock-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          clockControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

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
            {/* <SlimeStoreSwitch
              label="Show Clock"
              baseId="clock-show-switch"
              storePath={["clockSettings", "show"]}
              labelHoverTabContentDisplay={[
                "Show Clock",
                "Whether to show the clock display. Please note that disabling the clock will remove some options from the ",
              ]}
            /> */}
            <AnimatePresence>
              {showClock && (
                <motion.div
                  className="overflow-clip"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                >
                  <SlimeStoreSlider
                    label="Size"
                    baseInputId="clock-size-slider"
                    min={CLOCK_CONTROLS_CONFIGS.size!.min}
                    max={CLOCK_CONTROLS_CONFIGS.size!.max}
                    step={CLOCK_CONTROLS_CONFIGS.size!.step}
                    storePath={["clockSettings", "size"]}
                    labelHoverTabContentDisplay={[
                      "Clock Size",
                      <div className="px-2 py-1">
                        Changes the size of the clock display. Values are a
                        percentage of screen height, where
                        <CodeBlock>1</CodeBlock>
                        would be practically invisible,
                        <CodeBlock>50</CodeBlock>
                        would fill half the screen, and
                        <CodeBlock>100</CodeBlock>
                        would fill the entire screen height.
                      </div>,
                    ]}
                  />
                  {/* TODO: Add position */}
                  <SlimeStoreSelect
                    label="Hour Format"
                    baseInputId="clock-hour-format-select"
                    placeholder="Hour Format"
                    storePath={["clockSettings", "hourFormat"]}
                    options={clockFormatOptions}
                    labelHoverTabContentDisplay={[
                      "Hour Format",
                      "12 hour or 24 hour format.",
                    ]}
                  />
                  {/* <AnimatePresence>
                    {clockHourFormat === "12h" && (
                      <motion.div
                        className="overflow-clip"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                      >
                        <SlimeStoreSwitch
                          label="Show AM/PM"
                          labelHoverTabContentDisplay={[
                            "Show AM/PM",
                            "Whether to show AM/PM in the clock display.",
                          ]}
                          baseId="clock-show-am-pm-switch"
                          storePath={["clockSettings", "showAmPm"]}
                        />
                      </motion.div>
                      // TODO: Add AM/PM size and position settings.
                    )}
                  </AnimatePresence> */}
                  <SlimeStoreSelect
                    label="Digit Style"
                    baseInputId="clock-digit-style-select"
                    placeholder="Digit Style"
                    storePath={["clockSettings", "digitStyle"]}
                    options={clockStyleOptions}
                    labelHoverTabContentDisplay={[
                      "Digit Style",
                      "Changes the digit style of the clock display.",
                    ]}
                  />
                  <SlimeStoreSwitch
                    label="Pad Hours"
                    baseId="clock-pad-hours-switch"
                    storePath={["clockSettings", "padHours"]}
                    labelHoverTabContentDisplay={[
                      "Pad Hours",
                      "Whether to pad hours with a leading zero.",
                    ]}
                  />
                  {/* <SlimeStoreSwitch
                    label="Show Seconds"
                    baseId="clock-show-seconds-switch"
                    storePath={["clockSettings", "showSeconds"]}
                    labelHoverTabContentDisplay={[
                      "Show Seconds",
                      "Whether to show seconds in the clock display.",
                    ]}
                  /> */}
                </motion.div>
              )}
            </AnimatePresence>
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
