import { produce } from "immer";
import * as R from "ramda";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import SlimeStoreSlider from "./SlimeStoreSlider";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function ColorControls() {
  function handleOnValueChange(value: number[], storePath: string[]) {
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaContentName = "procedural-color-palette";
        state.controlsState.displayAreaContentType = "three";
        state.colorSettings.slimeColorChangedAt = Date.now();
      }),
    );
    useSlimeStore.setState(R.over(R.lensPath(storePath), () => value[0]));
  }

  return (
    <TabContentContainer tabsValue="color-controls">
      <TabContentScrollArea title="Color">
        <AccordionControlsWrapper
          type="multiple"
          defaultValue={["procedural-color-palette"]}
        >
          <AccordionControlsItem
            value="procedural-color-palette"
            label="Procedural Color Palette"
          >
            <AccordionControlsWrapper type="multiple" defaultValue={["red"]}>
              <AccordionControlsItem value="red" label="Red">
                <SlimeStoreSlider
                  label="Y-Offset"
                  baseInputId="procedural-color-palette-r-y-offset"
                  min={0}
                  max={1}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "yOffset",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "yOffset",
                    ])
                  }
                />
              </AccordionControlsItem>
            </AccordionControlsWrapper>
          </AccordionControlsItem>
        </AccordionControlsWrapper>
      </TabContentScrollArea>
    </TabContentContainer>
  );
}
