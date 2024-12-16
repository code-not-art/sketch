import type { Identity } from '../../types/Identity.js';

export const ControlPanelParameterTypes = [
  'boolean',
  'multiSelect',
  'number',
  'randomSeed',
  'range',
  'string',
] as const;
export type ControlPanelParameterType =
  (typeof ControlPanelParameterTypes)[number];

export type ControlPanelParameterBase<
  TDataType extends ControlPanelParameterType,
  TValue,
> = {
  dataType: TDataType;
  label: string;
  initialValue?: TValue;
  hidden: boolean;
  editable: boolean;
};

export type ControlPanelParameterBaseConfig<TValue> = {
  label: string;
  initialValue?: TValue;
  hidden?: boolean;
  editable?: boolean;
};

type ParameterTemplate<
  TDataType extends ControlPanelParameterType,
  TValue,
  TConfig,
> = Identity<ControlPanelParameterBase<TDataType, TValue> & TConfig>;

export type ControlPanelParameterBooleanConfig = object;
export type ControlPanelValueBoolean = boolean;
export type ControlPanelParameterBoolean = ParameterTemplate<
  'boolean',
  ControlPanelValueBoolean,
  ControlPanelParameterBooleanConfig
>;

export type ControlPanelParameterMultiSelectConfig<TOptions extends string> = {
  options: ReadonlyArray<TOptions>;
};
export type ControlPanelValueMultiSelect<TOptions extends string> = {
  [Key in TOptions]: boolean;
};
export type ControlPanelParameterMultiSelect<TOptions extends string = string> =
  ParameterTemplate<
    'multiSelect',
    ControlPanelValueMultiSelect<TOptions>,
    ControlPanelParameterMultiSelectConfig<TOptions>
  >;

export type ControlPanelParameterNumberConfig = {
  min: number;
  max: number;
  step: number;
};
export type ControlPanelValueNumber = number;
export type ControlPanelParameterNumber = ParameterTemplate<
  'number',
  ControlPanelValueNumber,
  ControlPanelParameterNumberConfig
>;

export type ControlPanelParameterRandomSeedConfig = object;
export type ControlPanelValueRandomSeed = number;
export type ControlPanelParameterRandomSeed = ParameterTemplate<
  'randomSeed',
  ControlPanelValueRandomSeed,
  ControlPanelParameterRandomSeedConfig
>;
export type ControlPanelParameterRangeConfig = {
  min: number;
  max: number;
  step: number;
  startMax: number;
  endMin: number;
  diffMin: number;
  diffMax: number;
  initialStart?: number;
  initialEnd?: number;
};
export type Range = [number, number];
export type ControlPanelValueRange = [number, number];
export type ControlPanelParameterRange = ParameterTemplate<
  'range',
  ControlPanelValueRange,
  ControlPanelParameterRangeConfig
>;

export type ControlPanelParameterStringConfig = object;
export type ControlPanelValueString = string;
export type ControlPanelParameterString = ParameterTemplate<
  'string',
  ControlPanelValueString,
  ControlPanelParameterStringConfig
>;

export type ControlPanelParameter<TOptions extends string = string> =
  | ControlPanelParameterBoolean
  | ControlPanelParameterMultiSelect<TOptions>
  | ControlPanelParameterNumber
  | ControlPanelParameterRandomSeed
  | ControlPanelParameterRange
  | ControlPanelParameterString;
