import { produce } from "immer";
import * as R from "ramda";
import type { ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";

export default function SlimeStoreRandomizationControl({
  label,
  labelHoverTabContentDisplay,
  baseId,
  randomizationStorePath,
  onCheckedChange,
  onValueChange,
  listen,
}: {
  label?: string;
  labelHoverTabContentDisplay?: string | [string, string] | ReactNode;
  baseId?: string;
  randomizationStorePath: string[];
  onCheckedChange?: (value: boolean) => void;
  onRangeChange?: (value: [number, number]) => void;
  listen?: boolean;
}) {}
