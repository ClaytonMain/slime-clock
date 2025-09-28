import { type ReactNode } from "react";
import type {
  SelectOption,
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import ControlGroup from "./ControlGroup";
import SlimeStoreSelect from "./SlimeStoreSelect";

export default function SlimeStoreSelectControl({
  label,
  labelHoverTabContentDisplay,
  justifyContent,
  itemsAlign,
  labelWidth,
  labelTextAlign,
  onPointerOver,
  baseInputId,
  placeholder,
  storePath,
  options,
  onValueChange,
  listen = true,
  valueType = "string",
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  onPointerOver?: () => void;
  baseInputId?: string;
  placeholder?: string;
  storePath: string[];
  options: SelectOption<string>[];
  onValueChange?: (value: string) => void;
  listen?: boolean;
  valueType?: "string" | "number";
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
      <SlimeStoreSelect
        baseInputId={baseInputId}
        placeholder={placeholder}
        storePath={storePath}
        options={options}
        onValueChange={onValueChange}
        listen={listen}
        valueType={valueType}
      />
    </ControlGroup>
  );
}
