import { Color } from '@code-not-art/core';

export const ParameterType = {
  Checkbox: 'checkbox',
  Color: 'color',
  Header: 'header',
  Interval: 'interval',
  MultiSelect: 'multiselect',
  Range: 'range',
  Select: 'select',
  Text: 'string',
} as const;

export type ParameterType = typeof ParameterType;

type BaseParameter = {
  display: string;
  hidden: boolean;
  fixed: boolean;
};

export type CheckboxParameter = BaseParameter & {
  type: ParameterType['Checkbox'];
  value: boolean;
};
export type ColorParameter = BaseParameter & {
  type: ParameterType['Color'];
  value: Color;
};
export type HeaderParameter = BaseParameter & {
  type: ParameterType['Header'];
};
export type IntervalParameter = BaseParameter & {
  type: ParameterType['Interval'];
  options: RangeOptionsObject;
  value: [number, number];
};
export type MultiSelectParameter = BaseParameter & {
  type: ParameterType['MultiSelect'];
  value: Record<string, boolean>;
};
export type RangeParameter = BaseParameter & {
  type: ParameterType['Range'];
  options: RangeOptionsObject;
  value: number;
};
export type SelectParameter = BaseParameter & {
  type: ParameterType['Select'];
  options: string[];
  value: string;
};
export type TextParameter = BaseParameter & {
  type: ParameterType['Text'];
  value: string;
};

export type Parameter =
  | CheckboxParameter
  | ColorParameter
  | HeaderParameter
  | IntervalParameter
  | MultiSelectParameter
  | RangeParameter
  | SelectParameter
  | TextParameter;

export type RangeOptionsObject = { min?: number; max?: number; step?: number };
export type MultiSelectOptions = Record<string, boolean>;
export type RangeOptionsArray = [number, number, number] | [number, number];

export type ParameterValue<T extends Parameter> = T extends { value: infer K }
  ? K
  : never;

export type ParameterModel = Record<string, Parameter>;

export type ParameterModelValues<Config extends ParameterModel> =
  Config extends infer T
    ? { [K in keyof T]: T[K] extends Parameter ? ParameterValue<T[K]> : never }
    : never;
