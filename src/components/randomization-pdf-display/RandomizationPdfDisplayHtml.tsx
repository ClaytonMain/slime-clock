import useSlimeStore from "../../stores/useSlimeStore";

export default function RandomizationPdfDisplayHtml() {
  const displayAreaPdfValues = useSlimeStore(
    (state) => state.controlsState.displayAreaPdfValues,
  );

  return (
    <div>
      <h1>Randomization PDF Display</h1>
      <p>{displayAreaPdfValues.currentSettingValue}</p>
      <p>{JSON.stringify(displayAreaPdfValues.controlConfig)}</p>
      <p>
        {JSON.stringify(displayAreaPdfValues.numericRangeRandomizationSettings)}
      </p>
    </div>
  );
}
