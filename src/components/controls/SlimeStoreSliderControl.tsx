import { type ReactNode } from "react";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import ControlGroup from "./ControlGroup";
import SlimeStoreSlider from "./SlimeStoreSlider";

export default function SlimeStoreSliderControl({
  label,
  labelHoverTabContentDisplay,
  justifyContent,
  itemsAlign,
  labelWidth,
  labelTextAlign,
  onPointerOver,
  baseInputId,
  min,
  max,
  step,
  storePath,
  onValueChange,
  listen = true,
  type = "slider",
  hideSlider = false,
  boundValue = true,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  onPointerOver?: () => void;
  baseInputId?: string;
  min: number;
  max: number;
  step?: number;
  storePath: string[];
  onValueChange?: (value: number[]) => void;
  listen?: boolean;
  type?: "slider" | "range";
  hideSlider?: boolean;
  boundValue?: boolean;
}) {
  return (
    <ControlGroup
      label={label}
      labelHoverTabContentDisplay={labelHoverTabContentDisplay}
      justifyContent={justifyContent}
      itemsAlign={itemsAlign}
      labelWidth={labelWidth}
      labelTextAlign={labelTextAlign}
      onPointerOver={onPointerOver}
    >
      <SlimeStoreSlider
        baseInputId={baseInputId}
        min={min}
        max={max}
        step={step}
        storePath={storePath}
        onValueChange={onValueChange}
        listen={listen}
        type={type}
        hideSlider={hideSlider}
        boundValue={boundValue}
      />
    </ControlGroup>
  );
}
