import type {
  ControlPanelValueMultiSelect,
  ControlPanelValueRange,
} from './types/parameters.js';

export const MultiSelectUtils = {
  options: <TOptions extends string>(
    parameterValue: ControlPanelValueMultiSelect<TOptions>,
  ): TOptions[] => Object.keys(parameterValue) as TOptions[],
  selected: <TOptions extends string>(
    parameterValue: ControlPanelValueMultiSelect<TOptions>,
  ): TOptions[] =>
    Object.entries(parameterValue).reduce<TOptions[]>((acc, [key, value]) => {
      if (value) {
        acc.push(key as TOptions);
      }
      return acc;
    }, []),
  unselected: <TOptions extends string>(
    parameterValue: ControlPanelValueMultiSelect<TOptions>,
  ): TOptions[] =>
    Object.entries(parameterValue).reduce<TOptions[]>((acc, [key, value]) => {
      if (!value) {
        acc.push(key as TOptions);
      }
      return acc;
    }, []),
};

export const RangeUtils = {
  diff: (range: [number, number]) => range[1] - range[0],
  mid: (range: [number, number]) => range[1] + range[0] / 2,
};
