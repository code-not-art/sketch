import type {
	ControlPanelParameter,
	ControlPanelParameterMultiSelect,
	ControlPanelValueBoolean,
	ControlPanelValueMultiSelect,
	ControlPanelValueNumber,
	ControlPanelValueRandomSeed,
	ControlPanelValueRange,
	ControlPanelValueString,
} from './parameters.js';

export type ControlPanelElements = Record<string, ControlPanelElement<any>>;

export type ControlPanelConfig<TElements extends ControlPanelElements> = {
	title: string;
	description?: string;
	startCollapsed: boolean;
	elements: TElements;
};

export type ControlPanelElement<TElements extends ControlPanelElements | void = void> = TElements extends Record<
	string,
	any
>
	? ControlPanelConfig<TElements>
	: ControlPanelParameter;

export type ControlPanelParameterValue<T extends ControlPanelParameter> = T['dataType'] extends 'boolean'
	? ControlPanelValueBoolean
	: T['dataType'] extends 'number'
	? ControlPanelValueNumber
	: T extends ControlPanelParameterMultiSelect<infer TOptions>
	? ControlPanelValueMultiSelect<TOptions>
	: T['dataType'] extends 'randomSeed'
	? ControlPanelValueRandomSeed
	: T['dataType'] extends 'range'
	? ControlPanelValueRange
	: T['dataType'] extends 'string'
	? ControlPanelValueString
	: never;

export type ControlPanelParameterValues<TSection extends ControlPanelConfig<any>> = {
	[TKey in keyof TSection['elements']]: TSection['elements'][TKey] extends infer TValue
		? TValue extends ControlPanelParameter
			? ControlPanelParameterValue<TValue>
			: TValue extends ControlPanelConfig<any>
			? ControlPanelParameterValues<TValue>
			: never
		: never;
};
