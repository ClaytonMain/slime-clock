import type { ReactNode } from "react";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import ControlGroup from "./ControlGroup";
import SlimeStoreColorPicker from "./SlimeStoreColorPicker";

export default function SlimeStoreColorPickerControl({
  label,
  labelHoverTabContentDisplay,
  justifyContent,
  itemsAlign,
  labelWidth,
  labelTextAlign,
  onPointerOver,
  baseId,
  storePath,
  onValueChange,
  listen = true,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  onPointerOver?: () => void;
  baseId?: string;
  storePath: string[];
  onValueChange?: (newColor: string) => void;
  listen?: boolean;
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
      <SlimeStoreColorPicker
        baseId={baseId}
        storePath={storePath}
        onValueChange={onValueChange}
        listen={listen}
      />
    </ControlGroup>
  );
}
