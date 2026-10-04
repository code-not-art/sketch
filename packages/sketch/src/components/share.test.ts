// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { buildQueryString, getParamsFromQuery, getSeedsFromQuery } from './share.js';
import ImageState from './state/ImageState.js';

describe('share query', () => {
	it('round trips the seeds and seed locks, separately from the parameters', () => {
		const state = new ImageState({ seed: 'test' });
		state.setImage('my image');
		const query = buildQueryString(state, { size: 5 });

		expect(getParamsFromQuery(query)).toEqual({ size: 5 });
		expect(getSeedsFromQuery(query)).toEqual({
			currentImageSeed: 'my image',
			currentColorSeed: state.getColor(),
			imageLocked: true,
			colorLocked: false,
		});
	});

	it('restores the rendered seeds when a state is built from the query', () => {
		const original = new ImageState({ seed: 'test' });
		original.random();
		original.setColor('my color');
		const restored = new ImageState({ seed: 'other', ...getSeedsFromQuery(buildQueryString(original, {})) });

		expect(restored.getImage()).toBe(original.getImage());
		expect(restored.getColor()).toBe('my color');
		expect(restored.colorLocked).toBe(true);
		expect(restored.imageLocked).toBe(false);
	});

	it('reads seeds typed in older links as locked', () => {
		expect(getSeedsFromQuery("~(_ui~'typed~_c~'color)")).toMatchObject({
			currentImageSeed: 'typed',
			imageLocked: true,
			currentColorSeed: 'color',
			colorLocked: false,
		});
	});

	it('handles an empty query', () => {
		expect(getParamsFromQuery('')).toEqual({});
		expect(getSeedsFromQuery('').imageLocked).toBe(false);
	});
});
