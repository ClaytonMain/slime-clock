import { type ReactNode } from "react";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import ControlGroup from "./ControlGroup";
import SlimeStoreSwitch from "./SlimeStoreSwitch";

export default function SlimeStoreSwitchControl({
  label,
  labelHoverTabContentDisplay,
  justifyContent,
  itemsAlign,
  labelWidth,
  labelTextAlign,
  onPointerOver,
  baseId,
  storePath,
  onCheckedChange,
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
  onCheckedChange?: (value: boolean) => void;
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
      <SlimeStoreSwitch
        baseId={baseId}
        storePath={storePath}
        onCheckedChange={onCheckedChange}
        listen={listen}
      />
    </ControlGroup>
  );
}
