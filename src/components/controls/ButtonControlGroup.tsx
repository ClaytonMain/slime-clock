import { motion } from "motion/react";
import type { ReactNode } from "react";
import type {
  TailwindItemsAlignOption,
  TailwindJustifyContentOption,
} from "../../types/types";
import ControlGroup from "./ControlGroup";

export default function ButtonControlGroup({
  label,
  labelHoverTabContentDisplay,
  justifyContent,
  itemsAlign,
  labelWidth,
  labelTextAlign,
  onPointerOver,
  buttonConfigs,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  justifyContent?: TailwindJustifyContentOption;
  itemsAlign?: TailwindItemsAlignOption;
  labelWidth?: string;
  labelTextAlign?: string;
  onPointerOver?: () => void;
  buttonConfigs: {
    label: string;
    baseId?: string;
    onClick: () => void;
    color?: "danger";
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
      {buttonConfigs.map((buttonConfig, index) => (
        <motion.button
          key={index}
          className={[
            "flex cursor-pointer border px-2 py-1",
            buttonConfig.color === "danger"
              ? "border-red-800"
              : "border-sky-800",
          ].join(" ")}
          id={
            (buttonConfig.baseId ?? label)
              ? `${label}-${index}`
              : `button-${index}`
          }
          onClick={buttonConfig.onClick}
          style={{
            backgroundColor:
              buttonConfig.color === "danger" ? "#3b0a0a" : "#18181b",
          }}
          whileHover={{
            backgroundColor:
              buttonConfig.color === "danger" ? "#5c0d0d" : "#27272a",
          }}
        >
          {buttonConfig.label}
        </motion.button>
      ))}
    </ControlGroup>
  );
}
