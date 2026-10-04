import { describe, expect, it } from 'vitest';
import { Parameters } from '../../control-panel/Parameters.js';
import { clampRange } from './rangeClamp.js';

const parameter = Parameters.range({ label: 'range', min: 0, max: 10, step: 1, diffMin: 2, diffMax: 6 });

describe('clampRange', () => {
	it('leaves a valid range unchanged', () => {
		expect(clampRange([2, 5], [2, 4], parameter)).toEqual([2, 5]);
	});

	it('swaps a reversed range', () => {
		expect(clampRange([5, 2], [2, 4], parameter)).toEqual([2, 5]);
	});

	it('keeps the end fixed and moves the start when the end handle makes the range too small', () => {
		expect(clampRange([3, 4], [3, 8], parameter)).toEqual([2, 4]);
	});

	it('keeps the start fixed and moves the end when the start handle makes the range too small', () => {
		expect(clampRange([5, 6], [3, 6], parameter)).toEqual([5, 7]);
	});

	it('limits the range to diffMax, moving the handle that was not edited', () => {
		expect(clampRange([1, 9], [3, 9], parameter)).toEqual([1, 7]);
		expect(clampRange([3, 10], [3, 5], parameter)).toEqual([4, 10]);
	});

	it('applies startMax and endMin', () => {
		const limited = Parameters.range({ label: 'limited', min: 0, max: 10, step: 1, startMax: 4, endMin: 6 });
		expect(clampRange([5, 5], [3, 7], limited)).toEqual([4, 6]);
	});
});
