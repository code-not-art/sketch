import { Color } from '@code-not-art/core';
import {
  CheckboxParameter,
  ColorParameter,
  HeaderParameter,
  IntervalParameter,
  MultiSelectOptions,
  MultiSelectParameter,
  ParameterType,
  RangeOptionsArray,
  RangeOptionsObject,
  RangeParameter,
  SelectParameter,
  TextParameter,
} from './types.js';

/**
 * Define a boolean checkbox Parameter
 * @param display {string}
 * @param value {boolean}
 * @returns {Parameter}
 */
const checkbox = (display: string, value: boolean): CheckboxParameter => ({
  display,
  hidden: false,
  fixed: false,
  type: ParameterType.Checkbox,
  value,
});

/**
 * Define a color selection Parameter
 * @param display
 * @param value
 * @returns
 */
const color = (display: string, value: Color): ColorParameter => ({
  type: ParameterType.Color,
  hidden: false,
  fixed: false,
  display,
  value,
});

/**
 * Define a header for the Parameter control menu
 * @param display {string}
 * @returns {Parameter}
 */
const header = (display: string): HeaderParameter => ({
  type: ParameterType.Header,
  hidden: false,
  fixed: false,
  display,
});

type ArrayValue<T> = T extends Array<infer U> ? U : never;

const select = <Options extends string, OptionsArray extends Array<Options>>(
  display: string,
  value: ArrayValue<OptionsArray>,
  options: OptionsArray,
): SelectParameter => ({
  type: ParameterType.Select,
  hidden: false,
  fixed: false,
  display,
  options,
  value,
});

// ===== Range and Interval selects with their complicated options

const parseRangeOptions = (
  options: RangeOptionsObject | RangeOptionsArray,
): RangeOptionsObject => {
  if (Array.isArray(options)) {
    return {
      min: options[0],
      max: options[1],
      step: options[2] || 0.01,
    };
  } else {
    return {
      min: options.min || 0,
      max: options.max || 1,
      step: options.step || 0.01,
    };
  }
};
/**
 * Define a range Parameter
 * @param display {string}
 * @param value {number}
 * @param options {RangeOptionsObject | RangeOptionsArray} [min, max, step] with default [0, 1, 0.01] Specifies the min, max, and step for the range. If the 3rd element of the tuple is omitted, the step will default to 0.01 . Default range if no options are provided is from 0 to 1 with step size of 0.01 . Can also be given an object with each property defined.
 * @returns {Parameter}
 */
const range = (
  display: string,
  value: number,
  options: RangeOptionsObject | RangeOptionsArray = [0, 1, 0.01],
): RangeParameter => ({
  type: ParameterType.Range,
  hidden: false,
  fixed: false,
  display,
  options: parseRangeOptions(options),
  value,
});

/**
 * Define an interval Parameter
 * @param display {string}
 * @param value {[number, number]} low and high limits of the initial interval value, as a tuple: ex. [0.25, 0.75]
 * @param options {RangeOptionsObject | RangeOptionsArray} [min, max, step] with default [0, 1, 0.01] Specifies the min, max, and step for the range. If the 3rd element of the tuple is omitted, the step will default to 0.01 . Default range if no options are provided is from 0 to 1 with step size of 0.01 . Can also be given an object with each property defined.
 * @returns {Parameter}
 */
const interval = (
  display: string,
  value: [number, number],
  options: RangeOptionsObject | RangeOptionsArray = [0, 1, 0.01],
): IntervalParameter => ({
  type: ParameterType.Interval,
  hidden: false,
  fixed: false,
  display,
  options: parseRangeOptions(options),
  value,
});

const multiselect = (
  display: string,
  value: MultiSelectOptions,
): MultiSelectParameter => {
  return {
    type: ParameterType.MultiSelect,
    hidden: false,
    fixed: false,
    display,
    value,
  };
};
const text = (display: string, value: string): TextParameter => {
  return {
    type: ParameterType.Text,
    hidden: false,
    fixed: false,
    display,
    value,
  };
};

export const Params = {
  checkbox,
  color,
  header,
  interval,
  multiselect,
  range,
  select,
  text,
};
