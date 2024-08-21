import type { Defined } from '../types/Defined.js';
import type { Identity } from '../types/Identity.js';
import type {
  ControlPanelConfig,
  ControlPanelElement,
  ControlPanelParameterValues,
} from './types/controlPanel.js';
import type {
  ControlPanelParameter,
  ControlPanelParameterBaseConfig,
  ControlPanelParameterNumber,
  ControlPanelParameterNumberConfig,
  ControlPanelParameterString,
  ControlPanelParameterStringConfig,
  ControlPanelParameterType,
} from './types/parameters.js';

const withDefault = <T>(value: T | undefined, defaultValue: T): T =>
  value !== undefined ? value : defaultValue;

const stringParameter = (
  config: Identity<
    Partial<ControlPanelParameterStringConfig> &
      ControlPanelParameterBaseConfig<string>
  >,
): ControlPanelParameterString => {
  return {
    dataType: 'string',
    ...config,
    editable: withDefault(config?.editable, true),
    hidden: withDefault(config?.hidden, false),
  };
};

const numberParameter = (
  config: Identity<
    Partial<ControlPanelParameterNumberConfig> &
      ControlPanelParameterBaseConfig<number>
  >,
): ControlPanelParameterNumber => {
  const min = withDefault(config.min, 0);
  const max = withDefault(config.max, min >= 1 ? min * 10 : 1);
  const delta = max - min;
  const step = withDefault(config.step, delta <= 1 ? 1 / 200 : delta / 200);
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

export const Parameters = {
  string: stringParameter,
  number: numberParameter,
} satisfies Record<
  ControlPanelParameterType,
  (config: any) => ControlPanelParameter
>;

/* ******************************** *
 * Initial Parameter Value resolution
 * ******************************** */

export const initialParameterValueString = (
  config: ControlPanelParameterString,
): Defined<ControlPanelParameterString['initialValue']> => {
  return config.initialValue || '';
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

const isElementAParameter = (
  input: ControlPanelConfig<any> | ControlPanelParameter,
) => input && 'dataType' in input;

export const initialControlPanelValues = <
  TConfig extends ControlPanelConfig<Record<string, ControlPanelElement<any>>>,
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
        case 'string': {
          collector[key] = initialParameterValueString(value);
          break;
        }
        case 'number': {
          collector[key] = initialParameterValueNumber(value);
          break;
        }
      }
    } else {
      collector[key] = initialControlPanelValues(value);
    }
  }
  return collector as ControlPanelParameterValues<TConfig>;
};
