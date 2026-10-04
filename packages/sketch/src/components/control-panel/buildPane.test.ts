// @vitest-environment jsdom
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Pane } from 'tweakpane';
import { ControlPanel } from '../../control-panel/ControlPanel.js';
import { initialControlPanelValues, Parameters } from '../../control-panel/Parameters.js';
import { addControlPanelElements, type SectionValues } from './buildPane.js';

const controls = ControlPanel('Test', {
	enabled: Parameters.boolean({ label: 'Enabled', initialValue: true }),
	name: Parameters.string({ label: 'Name', initialValue: 'sketch' }),
	count: Parameters.number({ label: 'Count', min: 0, max: 10, step: 1, initialValue: 4 }),
	mode: Parameters.select({ label: 'Mode', options: ['a', 'b'], initialValue: 'b' }),
	shapes: Parameters.multiSelect({ label: 'Shapes', options: ['circle', 'square'], initialValue: { circle: true } }),
	spread: Parameters.range({ label: 'Spread', min: 0, max: 10, step: 1, initialValue: [2, 8] }),
	seed: Parameters.randomSeed({ label: 'Seed', initialValue: 0.25 }),
	nested: ControlPanel('Nested', { depth: Parameters.number({ label: 'Depth', min: 0, max: 5, step: 1 }) }),
});

describe('addControlPanelElements', () => {
	let pane: Pane;
	let values: SectionValues;
	const notify = vi.fn();

	beforeEach(() => {
		notify.mockClear();
		pane = new Pane({ container: document.body });
		pane.registerPlugin(EssentialsPlugin);
		values = { ...initialControlPanelValues(controls) };
		addControlPanelElements(pane, controls, values, notify);
	});

	afterEach(() => {
		pane.dispose();
	});

	it('renders a control for every parameter type, including nested sections', () => {
		expect(pane.element.querySelector('.tp-ckbv')).not.toBeNull(); // boolean
		expect(pane.element.querySelector('.tp-txtv')).not.toBeNull(); // string and number
		expect(pane.element.querySelector('.tp-sldtxtv')).not.toBeNull(); // number slider
		expect(pane.element.querySelector('.tp-lstv')).not.toBeNull(); // select
		const folderTitles = [...pane.element.querySelectorAll('.tp-fldv_t')].map((title) => title.textContent);
		expect(folderTitles).toEqual(['Shapes', 'Nested']);
		expect(pane.element.querySelector('.tp-rsltxtv')).not.toBeNull(); // range
		expect(pane.element.textContent).toContain('Previous');
	});

	it('keeps the initial values', () => {
		expect(values).toEqual({
			enabled: true,
			name: 'sketch',
			count: 4,
			mode: 'b',
			shapes: { circle: true, square: false },
			spread: [2, 8],
			seed: 0.25,
			nested: { depth: 0 },
		});
	});

	it('writes edits into the values and notifies', () => {
		const checkbox = pane.element.querySelector<HTMLInputElement>('.tp-ckbv_i');
		checkbox?.click();
		expect(values.enabled).toBe(false);
		expect(notify).toHaveBeenCalled();
	});

	it('advances the random seed with the Next button', () => {
		const nextButton = [...pane.element.querySelectorAll<HTMLButtonElement>('.tp-btnv_b')].find(
			(button) => button.textContent === 'Next',
		);
		nextButton?.click();
		expect(values.seed).not.toBe(0.25);
		expect(notify).toHaveBeenCalled();
	});
});
