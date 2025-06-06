// Thanks to Miroslav Petrik for the generic select component tutorial
// https://miroslavpetrik.medium.com/lets-create-a-generic-select-component-in-react-typescript-fa720da0e015
// https://codesandbox.io/p/sandbox/generic-native-select-xw7pjg

export type UseSelectOptionsParams<Option> = {
  options: readonly Option[];
  getLabel: (option: Option) => string;
};

export function useSelectOptions<Option>({
  options,
  getLabel,
}: UseSelectOptionsParams<Option>) {
  return (
    <>
      {options.map((option, index) => (
        <option
          key={index}
          value={index}
        >
          {getLabel(option)}
        </option>
      ))}
    </>
  );
}
