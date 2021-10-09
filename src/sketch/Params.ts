export enum ParameterType {
  Checkbox = 'checkbox',
  // Color = 'color', // TODO - Make Color selector component
  Header = 'header',
  Interval = 'interval',
  Range = 'range',
  // Select = 'select', // TODO - Make Select parameter
  Text = 'string',
}

export interface Parameter {
  type: ParameterType;
  key: string;
  value?: any;
  rangeOptions?: RangeOptionsObject;
}
type RangeOptionsObject = { min: number; max: number; step: number };

/**
 * Define a boolean checkbox Parameter
 * @param key {string}
 * @param value {boolean}
 * @returns {Parameter}
 */
const checkbox = (key: string, value: boolean): Parameter => ({
  type: ParameterType.Checkbox,
  key,
  value,
});

/**
 * Define a header for the Parameter control menu
 * @param key {string}
 * @returns {Parameter}
 */
const header = (key: string): Parameter => ({
  type: ParameterType.Header,
  key,
});

type RangeOptionsArray = [number, number, number] | [number, number];
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
    return options;
  }
};
/**
 * Define a range Parameter
 * @param key {string}
 * @param value {number}
 * @param options {RangeOptionsObject | RangeOptionsArray} [min, max, step] with default [0, 1, 0.01] Specifies the min, max, and step for the range. If the 3rd element of the tuple is omitted, the step will default to 0.01 . Default range if no options are provided is from 0 to 1 with step size of 0.01 . Can also be given an object with each property defined.
 * @returns {Parameter}
 */
const range = (
  key: string,
  value: number,
  options: RangeOptionsObject | RangeOptionsArray = [0, 1, 0.01],
): Parameter => ({
  type: ParameterType.Range,
  key,
  value,
  rangeOptions: parseRangeOptions(options),
});

/**
 * Define an interval Parameter
 * @param key {string}
 * @param value {[number, number]} low and high limits of the initial interval value, as a tuple: ex. [0.25, 0.75]
 * @param options {RangeOptionsObject | RangeOptionsArray} [min, max, step] with default [0, 1, 0.01] Specifies the min, max, and step for the range. If the 3rd element of the tuple is omitted, the step will default to 0.01 . Default range if no options are provided is from 0 to 1 with step size of 0.01 . Can also be given an object with each property defined.
 * @returns {Parameter}
 */
const interval = (
  key: string,
  value: [number, number],
  options: RangeOptionsObject | RangeOptionsArray = [0, 1, 0.01],
): Parameter => ({
  type: ParameterType.Interval,
  key,
  value,
  rangeOptions: parseRangeOptions(options),
});

const Params = {
  checkbox,
  header,
  interval,
  range,
};

export default Params;
