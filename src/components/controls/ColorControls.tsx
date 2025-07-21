import { produce } from "immer";
import * as R from "ramda";
import { useEffect } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import AccordionControlsItem from "./AccordionControlsItem";
import AccordionControlsWrapper from "./AccordionControlsWrapper";
import ProceduralColorPalettePresetSelect from "./ProceduralColorPalettePresetSelect";
import SlimeStoreSliderControl from "./SlimeStoreSliderControl";
import TabContentContainer from "./TabContentContainer";
import TabContentScrollArea from "./TabContentScrollArea";

export default function ColorControls() {
  const selectedTab = useSlimeStore((state) => state.controlsState.selectedTab);

  const colorControlsLabelHoverTabContentDisplay = [
    "Color Controls",
    "Controls related to the color settings.",
  ];

  useEffect(() => {
    if (selectedTab !== "color-controls") return;
    useSlimeStore.setState(
      produce((state) => {
        state.controlsState.displayAreaHtmlContent =
          colorControlsLabelHoverTabContentDisplay;
        state.controlsState.displayAreaContentType = "html";
        state.controlsState.displayAreaContentName = null;
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

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
            padContent={false}
          >
            <ProceduralColorPalettePresetSelect />
            <AccordionControlsWrapper
              type="multiple"
              defaultValue={["red", "green", "blue"]}
            >
              <AccordionControlsItem value="red" label="Red">
                <SlimeStoreSliderControl
                  label="Y-Offset"
                  baseInputId="procedural-color-palette-r-y-offset"
                  min={-1}
                  max={2}
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
                <SlimeStoreSliderControl
                  label="amplitude"
                  baseInputId="procedural-color-palette-r-amplitude"
                  min={-5}
                  max={5}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "amplitude",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "amplitude",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="frequency"
                  baseInputId="procedural-color-palette-r-frequency"
                  min={-5}
                  max={5}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "frequency",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "frequency",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="phase"
                  baseInputId="procedural-color-palette-r-phase"
                  min={Math.round(-Math.PI * 100) / 100}
                  max={Math.round(Math.PI * 100) / 100}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "r",
                    "phase",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "r",
                      "phase",
                    ])
                  }
                />
              </AccordionControlsItem>
              <AccordionControlsItem value="green" label="Green">
                <SlimeStoreSliderControl
                  label="Y-Offset"
                  baseInputId="procedural-color-palette-g-y-offset"
                  min={-1}
                  max={2}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "yOffset",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "yOffset",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="amplitude"
                  baseInputId="procedural-color-palette-g-amplitude"
                  min={-5}
                  max={5}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "amplitude",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "amplitude",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="frequency"
                  baseInputId="procedural-color-palette-g-frequency"
                  min={-5}
                  max={5}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "frequency",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "frequency",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="phase"
                  baseInputId="procedural-color-palette-g-phase"
                  min={Math.round(-Math.PI * 100) / 100}
                  max={Math.round(Math.PI * 100) / 100}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "g",
                    "phase",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "g",
                      "phase",
                    ])
                  }
                />
              </AccordionControlsItem>
              <AccordionControlsItem value="blue" label="Blue">
                <SlimeStoreSliderControl
                  label="Y-Offset"
                  baseInputId="procedural-color-palette-b-y-offset"
                  min={-1}
                  max={2}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "yOffset",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "yOffset",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="amplitude"
                  baseInputId="procedural-color-palette-b-amplitude"
                  min={-5}
                  max={5}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "amplitude",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "amplitude",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="frequency"
                  baseInputId="procedural-color-palette-b-frequency"
                  min={-5}
                  max={5}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "frequency",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "frequency",
                    ])
                  }
                />
                <SlimeStoreSliderControl
                  label="phase"
                  baseInputId="procedural-color-palette-b-phase"
                  min={Math.round(-Math.PI * 100) / 100}
                  max={Math.round(Math.PI * 100) / 100}
                  step={0.01}
                  storePath={[
                    "colorSettings",
                    "proceduralColorPalette",
                    "b",
                    "phase",
                  ]}
                  onValueChange={(value) =>
                    handleOnValueChange(value, [
                      "colorSettings",
                      "proceduralColorPalette",
                      "b",
                      "phase",
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
