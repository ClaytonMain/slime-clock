import type { ReactNode } from "react";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import ControlGroup from "./ControlGroup";
import SlimeStoreSwitch from "./SlimeStoreSwitch";

export default function SwitchControlGroup({
  label,
  labelHoverTabContentDisplay,
  justifyContent = "start",
  itemsAlign = "center",
  labelWidth,
  labelTextAlign,
  onPointerOver,
  switchConfigs,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  onPointerOver?: () => void;
  switchConfigs: {
    label: string;
    baseId?: string;
    storePath: string[];
    onCheckedChange?: (value: boolean) => void;
    listen?: boolean;
  }[];
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
      <div
        className={`flex w-full flex-wrap items-${itemsAlign} justify-${justifyContent} gap-1`}
        style={{
          paddingRight: "calc(var(--spacing) * 2)",
          paddingLeft: label ? undefined : "calc(var(--spacing) * 2)",
        }}
      >
        {switchConfigs.map((switchConfig, index) => (
          <SlimeStoreSwitch
            key={index}
            baseId={switchConfig.baseId}
            storePath={switchConfig.storePath}
            onCheckedChange={switchConfig.onCheckedChange}
            listen={switchConfig.listen}
            switchLabel={switchConfig.label}
            darkenBackground
          />
        ))}
      </div>
    </ControlGroup>
  );
}
