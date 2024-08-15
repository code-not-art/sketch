import type { Identity } from '../../types/Identity.js';

export const ControlPanelParameterTypes = ['string', 'number'] as const;
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

export type ControlPanelParameterStringConfig = object;
export type ControlPanelValueString = string;
export type ControlPanelParameterString = ParameterTemplate<
  'string',
  ControlPanelValueString,
  ControlPanelParameterStringConfig
>;

export type ControlPanelParameterNumberConfig = {
  min?: number;
  max?: number;
};
export type ControlPanelValueNumber = number;
export type ControlPanelParameterNumber = ParameterTemplate<
  'number',
  ControlPanelValueNumber,
  ControlPanelParameterNumberConfig
>;

export type ControlPanelParameter =
  | ControlPanelParameterString
  | ControlPanelParameterNumber;
