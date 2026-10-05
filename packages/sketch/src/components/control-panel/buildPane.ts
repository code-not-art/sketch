import { ButtonGridApi } from '@tweakpane/plugin-essentials';
import type { FolderApi, Pane } from 'tweakpane';
import type { ControlPanelConfig, ControlPanelElements } from '../../control-panel/types/controlPanel.js';
import type {
	ControlPanelParameter,
	ControlPanelParameterMultiSelect,
	ControlPanelParameterNumber,
	ControlPanelParameterRandomSeed,
	ControlPanelParameterRange,
	ControlPanelParameterSelect,
	Range,
} from '../../control-panel/types/parameters.js';
import { SeedHistory } from './SeedHistory.js';
import { clampRange } from './rangeClamp.js';

/**
 * Anything that can receive Tweakpane blades. Both the root `Pane` and a `FolderApi` satisfy this.
 */
export type PaneContainer = Pane | FolderApi;

/**
 * Mutable object holding the current value of every parameter in one control panel section. Tweakpane writes user
 * changes directly into these objects. Nested sections are nested objects.
 */
export type SectionValues = Record<string, unknown>;

const isSectionValues = (value: unknown): value is SectionValues =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const isRange = (value: unknown): value is Range =>
	Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';

/**
 * Returns the nested values object stored at `key`, creating it when missing so that Tweakpane has an object to bind.
 */
const getSectionValues = (values: SectionValues, key: string): SectionValues => {
	const existing = values[key];
	if (isSectionValues(existing)) {
		return existing;
	}
	const created: SectionValues = {};
	values[key] = created;
	return created;
};

/**
 * Applies the `hidden` and `editable` flags that every parameter type supports to a blade.
 */
const applyParameterState = (blade: { hidden: boolean; disabled: boolean }, parameter: ControlPanelParameter): void => {
	blade.hidden = parameter.hidden;
	blade.disabled = !parameter.editable;
};

const addNumber = (
	container: PaneContainer,
	key: string,
	parameter: ControlPanelParameterNumber,
	values: SectionValues,
	notify: () => void,
): void => {
	const binding = container.addBinding(values, key, {
		label: parameter.label,
		min: parameter.min,
		max: parameter.max,
		step: parameter.step,
	});
	binding.on('change', () => notify());
	applyParameterState(binding, parameter);
};

const addSelect = (
	container: PaneContainer,
	key: string,
	parameter: ControlPanelParameterSelect,
	values: SectionValues,
	notify: () => void,
): void => {
	const options = Object.fromEntries(parameter.options.map((option) => [option, option]));
	const binding = container.addBinding(values, key, { label: parameter.label, options });
	binding.on('change', () => notify());
	applyParameterState(binding, parameter);
};

const addMultiSelect = (
	container: PaneContainer,
	key: string,
	parameter: ControlPanelParameterMultiSelect,
	values: SectionValues,
	notify: () => void,
): void => {
	const folder = container.addFolder({ title: parameter.label });
	const selection = getSectionValues(values, key);
	for (const option of parameter.options) {
		const binding = folder.addBinding(selection, option, { label: option });
		binding.on('change', () => notify());
		applyParameterState(binding, parameter);
	}
	folder.hidden = parameter.hidden;
};

const addRange = (
	container: PaneContainer,
	key: string,
	parameter: ControlPanelParameterRange,
	values: SectionValues,
	notify: () => void,
): void => {
	const initialValue = values[key];
	let currentRange: Range = isRange(initialValue) ? [...initialValue] : [parameter.min, parameter.max];
	values[key] = [...currentRange];

	// The essentials interval binding edits an object of the form `{ min, max }`, so a proxy object is bound and its
	// value is copied into the section values as a `[start, end]` tuple.
	const proxy = { range: { min: currentRange[0], max: currentRange[1] } };
	const binding = container.addBinding(proxy, 'range', {
		label: parameter.label,
		min: parameter.min,
		max: parameter.max,
		step: parameter.step,
	});
	binding.on('change', () => {
		const proposed: Range = [proxy.range.min, proxy.range.max];
		const clamped = clampRange(proposed, currentRange, parameter);
		currentRange = clamped;
		values[key] = [...clamped];
		if (clamped[0] !== proposed[0] || clamped[1] !== proposed[1]) {
			// Refreshing re-emits a change event, which finds the range already clamped and ends the cycle
			proxy.range = { min: clamped[0], max: clamped[1] };
			binding.refresh();
		}
		notify();
	});
	applyParameterState(binding, parameter);
};

const SEED_BUTTON_TITLES = ['Previous', 'Next', 'Random'] as const;

const addRandomSeed = (
	container: PaneContainer,
	key: string,
	parameter: ControlPanelParameterRandomSeed,
	values: SectionValues,
	notify: () => void,
): void => {
	const initialValue = values[key];
	const history = new SeedHistory(typeof initialValue === 'number' ? initialValue : Math.random());
	values[key] = history.active;

	let refreshing = false;
	const binding = container.addBinding(values, key, { label: parameter.label });
	const buttons = container.addBlade({
		view: 'buttongrid',
		size: [SEED_BUTTON_TITLES.length, 1],
		cells: (column: number) => ({ title: SEED_BUTTON_TITLES[column] }),
	});
	if (!(buttons instanceof ButtonGridApi)) {
		throw new Error('The Tweakpane essentials plugin must be registered to render random seed parameters.');
	}

	const updatePreviousButton = (): void => {
		const previousButton = buttons.cell(0, 0);
		if (previousButton) {
			previousButton.disabled = !history.hasPrevious;
		}
	};
	const setSeed = (seed: number): void => {
		values[key] = seed;
		refreshing = true;
		binding.refresh();
		refreshing = false;
		updatePreviousButton();
		notify();
	};

	binding.on('change', () => {
		// Values typed by the user become a new step in the history. Refreshes triggered by the buttons do not.
		const typedValue = values[key];
		if (!refreshing && typeof typedValue === 'number') {
			history.add(typedValue);
			updatePreviousButton();
			notify();
		}
	});
	buttons.on('click', (event) => {
		const [column] = event.index;
		switch (SEED_BUTTON_TITLES[column]) {
			case 'Previous': {
				setSeed(history.previous());
				break;
			}
			case 'Next': {
				setSeed(history.next());
				break;
			}
			case 'Random': {
				setSeed(history.random());
				break;
			}
		}
	});
	updatePreviousButton();
	applyParameterState(binding, parameter);
	buttons.hidden = parameter.hidden;
	buttons.disabled = !parameter.editable;
};

const addParameter = (
	container: PaneContainer,
	key: string,
	parameter: ControlPanelParameter,
	values: SectionValues,
	notify: () => void,
): void => {
	switch (parameter.dataType) {
		case 'boolean':
		case 'string': {
			const binding = container.addBinding(values, key, { label: parameter.label });
			binding.on('change', () => notify());
			applyParameterState(binding, parameter);
			return;
		}
		case 'number': {
			addNumber(container, key, parameter, values, notify);
			return;
		}
		case 'select': {
			addSelect(container, key, parameter, values, notify);
			return;
		}
		case 'multiSelect': {
			addMultiSelect(container, key, parameter, values, notify);
			return;
		}
		case 'range': {
			addRange(container, key, parameter, values, notify);
			return;
		}
		case 'randomSeed': {
			addRandomSeed(container, key, parameter, values, notify);
			return;
		}
	}
};

/**
 * Appends a block of description text to the top of a folder.
 */
const addDescription = (folder: FolderApi, description: string): void => {
	const content = folder.element.querySelector('.tp-fldv_c');
	if (!content) {
		return;
	}
	const element = document.createElement('div');
	element.className = 'sketch-section-description';
	element.textContent = description;
	content.prepend(element);
};

/**
 * Adds a Tweakpane blade for every element of a control panel section, recursing into nested sections as folders.
 *
 * Each `ControlPanelParameter` type is rendered by a matching Tweakpane component: `boolean` as a checkbox, `string`
 * as a text field, `number` as a slider with number field, `select` as a dropdown list, `multiSelect` as a folder of
 * checkboxes, `range` as a two-handle slider, and `randomSeed` as a number field with Previous, Next and Random
 * buttons. The pane must have the `@tweakpane/plugin-essentials` plugin registered for `range` and `randomSeed`.
 *
 * Tweakpane writes changes directly into `values`, which must already hold an entry for each parameter (see
 * `initialControlPanelValues`). Missing nested section objects are created.
 *
 * @param container The pane or folder to add the blades to.
 * @param config The control panel section to render.
 * @param values The mutable values for this section, updated as the user edits controls.
 * @param notify Called after any value in the section, or a nested section, changes.
 * @throws If a `randomSeed` parameter is rendered without the essentials plugin registered.
 */
export const addControlPanelElements = (
	container: PaneContainer,
	config: ControlPanelConfig<ControlPanelElements>,
	values: SectionValues,
	notify: () => void,
): void => {
	for (const [key, element] of Object.entries(config.elements)) {
		if ('dataType' in element) {
			addParameter(container, key, element, values, notify);
		} else {
			const folder = container.addFolder({ title: element.title, expanded: !element.startCollapsed });
			if (element.description) {
				addDescription(folder, element.description);
			}
			addControlPanelElements(folder, element, getSectionValues(values, key), notify);
		}
	}
};
