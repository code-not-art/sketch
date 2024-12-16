import type { Defined } from '../types/Defined.js';
import type { Identity } from '../types/Identity.js';
import { RangeUtils } from './parameterUtils.js';
import type {
  ControlPanelConfig,
  ControlPanelElements,
  ControlPanelParameterValues,
} from './types/controlPanel.js';
import type {
  ControlPanelParameter,
  ControlPanelParameterBaseConfig,
  ControlPanelParameterBoolean,
  ControlPanelParameterBooleanConfig,
  ControlPanelParameterMultiSelect,
  ControlPanelParameterMultiSelectConfig,
  ControlPanelParameterNumber,
  ControlPanelParameterNumberConfig,
  ControlPanelParameterRandomSeed,
  ControlPanelParameterRandomSeedConfig,
  ControlPanelParameterRange,
  ControlPanelParameterRangeConfig,
  ControlPanelParameterString,
  ControlPanelParameterStringConfig,
  ControlPanelParameterType,
  ControlPanelValueBoolean,
  ControlPanelValueMultiSelect,
  ControlPanelValueNumber,
  ControlPanelValueRandomSeed,
  ControlPanelValueRange,
  ControlPanelValueString,
} from './types/parameters.js';

const withDefault = <T>(value: T | undefined, defaultValue: T): T =>
  value !== undefined ? value : defaultValue;

const booleanParameter = (
  config: Identity<
    Partial<ControlPanelParameterBooleanConfig> &
      ControlPanelParameterBaseConfig<ControlPanelValueBoolean>
  >,
): ControlPanelParameterBoolean => {
  return {
    dataType: 'boolean',
    ...config,
    editable: withDefault(config?.editable, true),
    hidden: withDefault(config?.hidden, false),
  };
};

const numberParameter = (
  config: Identity<
    Partial<ControlPanelParameterNumberConfig> &
      ControlPanelParameterBaseConfig<ControlPanelValueNumber>
  >,
): ControlPanelParameterNumber => {
  const min = withDefault(config.min, 0);
  const max = withDefault(config.max, min >= 1 ? min * 10 : 1);
  const delta = max - min;
  const step = withDefault(config.step, delta <= 2 ? 1 / 200 : 1);
  return {
    dataType: 'number',
    ...config,
    editable: withDefault(config.editable, true),
    hidden: withDefault(config.hidden, false),
    min,
    max,
    step,
  };
};

const multiSelectParameter = <TOptions extends string>(
  config: Identity<
    Partial<ControlPanelParameterMultiSelectConfig<TOptions>> &
      ControlPanelParameterBaseConfig<ControlPanelValueMultiSelect<TOptions>>
  >,
): ControlPanelParameterMultiSelect<TOptions> => {
  return {
    dataType: 'multiSelect',
    ...config,
    editable: withDefault(config.editable, true),
    hidden: withDefault(config.hidden, false),
    options: withDefault(config.options, []),
  };
};

const randomSeedParameter = (
  config: Identity<
    Partial<ControlPanelParameterRandomSeedConfig> &
      ControlPanelParameterBaseConfig<ControlPanelValueRandomSeed>
  >,
): ControlPanelParameterRandomSeed => {
  return {
    dataType: 'randomSeed',
    ...config,
    editable: withDefault(config?.editable, true),
    hidden: withDefault(config?.hidden, false),
  };
};
const rangeParameter = (
  config: Identity<
    Partial<ControlPanelParameterRangeConfig> &
      ControlPanelParameterBaseConfig<ControlPanelValueRange>
  >,
): ControlPanelParameterRange => {
  const min = withDefault(config.min, 0);
  const max = withDefault(config.max, min >= 1 ? min * 10 : 1);
  const delta = max - min;
  const step = withDefault(config.step, delta <= 2 ? 1 / 200 : 1);
  return {
    dataType: 'range',
    ...config,
    editable: withDefault(config?.editable, true),
    hidden: withDefault(config?.hidden, false),
    min,
    max,
    step,
    startMax: withDefault(config.startMax, max),
    endMin: withDefault(config.endMin, min),
    diffMin: withDefault(config.diffMin, 0),
    diffMax: withDefault(config.diffMax, delta),
  };
};

const stringParameter = (
  config: Identity<
    Partial<ControlPanelParameterStringConfig> &
      ControlPanelParameterBaseConfig<ControlPanelValueString>
  >,
): ControlPanelParameterString => {
  return {
    dataType: 'string',
    ...config,
    editable: withDefault(config?.editable, true),
    hidden: withDefault(config?.hidden, false),
  };
};

export const Parameters = {
  boolean: booleanParameter,
  multiSelect: multiSelectParameter,
  number: numberParameter,
  randomSeed: randomSeedParameter,
  range: rangeParameter,
  string: stringParameter,
} satisfies Record<
  ControlPanelParameterType,
  (config: any) => ControlPanelParameter
>;

/* ******************************** *
 * Initial Parameter Value resolution
 * ******************************** */
export const initialParameterValueBoolean = (
  config: ControlPanelParameterBoolean,
): Defined<ControlPanelParameterBoolean['initialValue']> => {
  return config.initialValue || false;
};
export const initialParameterValueMultiSelect = (
  config: ControlPanelParameterMultiSelect,
): Defined<ControlPanelParameterMultiSelect['initialValue']> => {
  const defaultValue = config.options.reduce<
    Partial<Defined<ControlPanelParameterMultiSelect['initialValue']>>
  >((acc, option) => {
    acc[option] = false;
    return acc;
  }, {}) as Defined<ControlPanelParameterMultiSelect['initialValue']>;
  return { ...defaultValue, ...(config.initialValue || {}) };
};
export const initialParameterValueNumber = (
  config: ControlPanelParameterNumber,
): Defined<ControlPanelParameterNumber['initialValue']> => {
  return config.initialValue !== undefined
    ? config.initialValue
    : config.min !== undefined
    ? config.min
    : config.max !== undefined
    ? config.max
    : 0;
};
export const initialParameterValueRandomSeed = (
  config: ControlPanelParameterRandomSeed,
): Defined<ControlPanelParameterRandomSeed['initialValue']> => {
  return config.initialValue || Math.random();
};
export const initialParameterValueRange = (
  config: ControlPanelParameterRange,
): Defined<ControlPanelParameterRange['initialValue']> => {
  if (config.initialValue) {
    return config.initialValue;
  }
  let start = withDefault(config.initialStart, config.min);
  let end = withDefault(config.initialEnd, config.max);
  if (end - start > config.diffMax) {
    if (start + config.diffMax < config.endMin) {
      end = config.endMin;
      start = config.endMin - config.diffMax;
    } else {
      end = start + config.diffMax;
    }
  }
  return [start, end];
};
export const initialParameterValueString = (
  config: ControlPanelParameterString,
): Defined<ControlPanelParameterString['initialValue']> => {
  return config.initialValue || '';
};

const isElementAParameter = (
  input: ControlPanelConfig<any> | ControlPanelParameter,
) => input && 'dataType' in input;

export const initialControlPanelValues = <
  TConfig extends ControlPanelConfig<ControlPanelElements>,
>(
  config: TConfig,
): ControlPanelParameterValues<TConfig> => {
  // TS Hacks here. Really fighting with recursive + generic syntax.
  const collector: Record<string, any> = {};
  if (!config?.elements) {
    console.log(
      `Can't parse control panel section: ${JSON.stringify(config, null, 2)}`,
    );
    return collector as ControlPanelParameterValues<TConfig>;
  }
  for (const [key, value] of Object.entries(config.elements)) {
    if (isElementAParameter(value)) {
      switch (value.dataType) {
        case 'boolean': {
          collector[key] = initialParameterValueBoolean(value);
          break;
        }
        case 'multiSelect': {
          collector[key] = initialParameterValueMultiSelect(value);
          break;
        }
        case 'number': {
          collector[key] = initialParameterValueNumber(value);
          break;
        }
        case 'randomSeed': {
          collector[key] = initialParameterValueRandomSeed(value);
          break;
        }
        case 'range': {
          collector[key] = initialParameterValueRange(value);
          break;
        }
        case 'string': {
          collector[key] = initialParameterValueString(value);
          break;
        }
      }
    } else {
      collector[key] = initialControlPanelValues(value);
    }
  }
  return collector as ControlPanelParameterValues<TConfig>;
};
