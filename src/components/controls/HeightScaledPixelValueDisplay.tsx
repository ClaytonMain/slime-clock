import * as R from "ramda";
import { useEffect, useState, type ReactNode } from "react";
import useSlimeStore from "../../stores/useSlimeStore";
import { roundToFixed } from "../../utils/utils";
import CodeBlock from "../code-block/CodeBlock";

function convertToPixelValue({
  value,
  height,
  valueIsPercent = true,
  precision = 0,
}: {
  value: number;
  height: number;
  valueIsPercent?: boolean;
  precision?: number;
}): number {
  if (valueIsPercent) {
    return roundToFixed((value / 100) * height, precision);
  }
  return roundToFixed(value, precision);
}

export default function HeightScaledPixelValueDisplay({
  storePath,
  description,
  valueIsPercent = true,
  precision = 0,
}: {
  storePath: string[];
  description?: ReactNode;
  valueIsPercent?: boolean;
  precision?: number;
}) {
  const height = useSlimeStore(
    (state) => state.simulationSettings.displayTextureHeight,
  );
  const [pixelValue, setPixelValue] = useState<number>(
    convertToPixelValue({
      value: R.view(R.lensPath(storePath), useSlimeStore.getState()),
      height,
      valueIsPercent,
      precision,
    }),
  );

  useEffect(() => {
    const unsubscribe = useSlimeStore.subscribe(
      (state) => R.view(R.lensPath(storePath), state),
      (value) => {
        setPixelValue(convertToPixelValue({ value, height }));
      },
    );
    return () => unsubscribe();
  }, [storePath, height]);

  return (
    <div className="flex flex-col gap-1 px-2 py-1">
      {description && <span>{description}</span>}
      <span>
        Approx. pixel value:
        <br />
        <CodeBlock>{pixelValue.toFixed(precision)}px</CodeBlock>
      </span>
    </div>
  );
}
