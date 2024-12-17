import { Color } from '@code-not-art/core';
import { extractValuesFromParameterModel } from '../../../components/control-panel/extractValuesFromConfig.js';
import { Params } from '../../../sketch/params/index.js';
import { ParameterRecord } from '../../../components/control-panel/types.js';
import { describe, it, expect } from 'vitest';

describe('extractValuesFromConfig.ts', () => {
	it('Output object has correct keys', () => {
		const input = {
			checkbox: Params.checkbox('Checkbox', true),
			color: Params.color('Color', new Color({ h: 0, s: 0, v: 0 })),
			header: Params.header('Header '),
			interval: Params.interval('Interval', [1, 2]),
			multiselect: Params.multiselect('Multiselect', { a: true, b: false }),
			range: Params.range('Range', 1),
			select: Params.select('Select', 'a', ['a', 'b', 'c']),
		};
		const output = extractValuesFromParameterModel(input);
		expect(output).toHaveProperty('checkbox');
		expect(output).toHaveProperty('color');
		expect(output).toHaveProperty('interval');
		expect(output).toHaveProperty('multiselect');
		expect(output).toHaveProperty('range');
		expect(output).toHaveProperty('select');
	});
	it('Output object has correct values', () => {
		const color = new Color();
		const input = {
			checkbox: Params.checkbox('Checkbox', true),
			color: Params.color('Color', color),
			header: Params.header('Header '),
			interval: Params.interval('Interval', [1, 2]),
			multiselect: Params.multiselect('Multiselect', { a: true, b: false }),
			range: Params.range('Range', 5),
			select: Params.select('Select', 'a', ['a', 'b', 'c']),
		};
		const output = extractValuesFromParameterModel(input);
		expect(output.checkbox).toEqual(true);
		expect(output.color.get.hex()).toEqual(color.get.hex());
		expect(output.interval).toEqual([1, 2]);
		expect(output.multiselect).toEqual({ a: true, b: false });
		expect(output.range).toEqual(5);
		expect(output.select).toEqual('a');
	});
	it('Does not include headers in outputs', () => {
		const input = {
			header1: Params.header('Header 1'),
			checkbox: Params.checkbox('Checkbox', true),
			header2: Params.header('Header 2'),
		};
		const output = extractValuesFromParameterModel(input);
		expect(output).not.toHaveProperty('header1');
		expect(output).not.toHaveProperty('header2');
	});
});
