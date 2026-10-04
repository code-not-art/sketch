import { describe, expect, it } from 'vitest';
import ImageState from './ImageState.js';

describe('ImageState seed locks', () => {
	it('starts with unlocked, random seeds', () => {
		const state = new ImageState({ seed: 'test' });
		expect(state.imageLocked).toBe(false);
		expect(state.colorLocked).toBe(false);
		expect(state.getImage()).toBeTruthy();
		expect(state.getColor()).toBeTruthy();
	});

	it('changes unlocked seeds when randomized', () => {
		const state = new ImageState({ seed: 'test' });
		const { image, color } = { image: state.getImage(), color: state.getColor() };
		state.random();
		expect(state.getImage()).not.toBe(image);
		expect(state.getColor()).not.toBe(color);
	});

	it('locks a seed when it is set to a specific value', () => {
		const state = new ImageState({ seed: 'test' });
		state.setImage('my image');
		state.setColor('my color');
		expect(state.getImage()).toBe('my image');
		expect(state.getColor()).toBe('my color');
		expect(state.imageLocked).toBe(true);
		expect(state.colorLocked).toBe(true);
	});

	it('keeps locked seeds when randomized or navigated, while unlocked seeds still change', () => {
		const state = new ImageState({ seed: 'test' });
		state.setImage('my image');
		const color = state.getColor();

		state.random();
		state.nextImage();
		state.prevImage();
		state.randomImage();
		expect(state.getImage()).toBe('my image');
		expect(state.getColor()).not.toBe(color);

		const afterRandom = state.getColor();
		state.nextColor();
		expect(state.getColor()).not.toBe(afterRandom);
	});

	it('does not move a locked color seed with the arrow-key navigation', () => {
		const state = new ImageState({ seed: 'test' });
		state.random();
		const previous = state.getColor();
		state.setColorLocked(true);
		state.nextColor();
		state.prevColor();
		expect(state.getColor()).toBe(previous);
		state.setColorLocked(false);
		state.prevColor();
		expect(state.getColor()).not.toBe(previous);
	});

	it('starts from the given seeds and locks', () => {
		const state = new ImageState({
			seed: 'test',
			currentImageSeed: 'saved image',
			currentColorSeed: 'saved color',
			imageLocked: true,
			colorLocked: false,
		});
		expect(state.getImage()).toBe('saved image');
		expect(state.getColor()).toBe('saved color');
		state.random();
		expect(state.getImage()).toBe('saved image');
		expect(state.getColor()).not.toBe('saved color');
	});

	it('ignores an empty seed', () => {
		const state = new ImageState({ seed: 'test' });
		const image = state.getImage();
		state.setImage('');
		expect(state.getImage()).toBe(image);
		expect(state.imageLocked).toBe(false);
	});
});
