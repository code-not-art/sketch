import type {
  ControlPanelParameter,
  ControlPanelValueNumber,
  ControlPanelValueString,
} from './parameters.js';

export type ControlPanelConfig<
  TElements extends Record<string, ControlPanelElement<any>>,
> = {
  title: string;
  description?: string;
  elements: TElements;
};

export type ControlPanelElement<
  TElements extends Record<string, ControlPanelElement<any>> | void = void,
> = TElements extends Record<string, any>
  ? ControlPanelConfig<TElements>
  : ControlPanelParameter;

export type ControlPanelParameterValue<T extends ControlPanelParameter> =
  T['dataType'] extends 'string'
    ? ControlPanelValueString
    : T['dataType'] extends 'number'
    ? ControlPanelValueNumber
    : never;

export type ControlPanelParameterValues<
  TSection extends ControlPanelConfig<any>,
> = {
  [TKey in keyof TSection['elements']]: TSection['elements'][TKey] extends infer TValue
    ? TValue extends ControlPanelParameter
      ? ControlPanelParameterValue<TValue>
      : TValue extends ControlPanelConfig<any>
      ? ControlPanelParameterValues<TValue>
      : never
    : never;
};
