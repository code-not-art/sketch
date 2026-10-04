import type { BindingApi } from '@tweakpane/core';
import type { PaneContainer } from './buildPane.js';

/**
 * The seeds, seed locks and palette shown in the Seeds folder.
 */
export type SeedDisplay = {
	/** Seed that determines the image random number generator. */
	image: string;
	/** Seed that determines the palette. */
	color: string;
	/** `true` when the image seed does not change when randomized or navigated. */
	imageLocked: boolean;
	/** `true` when the color seed does not change when randomized or navigated. */
	colorLocked: boolean;
	/** CSS colors of the current palette, shown as swatches. */
	swatches: string[];
};

/**
 * The seed fields as edited by the user in the Seeds folder.
 */
export type SeedEdit = Pick<SeedDisplay, 'image' | 'color' | 'imageLocked' | 'colorLocked'>;

/**
 * Controls for updating an existing Seeds folder.
 */
export type SeedFolderHandle = {
	/**
	 * Replaces the displayed seeds, locks and palette without calling the change handler.
	 */
	update: (display: SeedDisplay) => void;
};

const LOCK_ICON =
	'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" ' +
	'stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/>' +
	'<path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

/**
 * Adds a lock checkbox, showing a lock icon, to the left of the text field of a seed binding.
 *
 * @returns The checkbox, so the caller can read and set its state.
 */
const addLockCheckbox = (binding: BindingApi, onChange: () => void): HTMLInputElement => {
	const label = document.createElement('label');
	label.className = 'sketch-lock';
	label.title = 'Lock this seed';
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	const icon = document.createElement('span');
	icon.innerHTML = LOCK_ICON;
	label.append(checkbox, icon);
	checkbox.addEventListener('change', onChange);

	const valueElement = binding.element.querySelector('.tp-lblv_v');
	valueElement?.classList.add('sketch-seed-value');
	valueElement?.prepend(label);
	return checkbox;
};

/**
 * Adds a collapsed "Seeds" folder with a text field and lock checkbox for each of the image and color seeds, and
 * swatches for the current palette.
 *
 * Typing in a text field sets the seed to that value. A locked seed does not change when new seeds are requested.
 *
 * @param container The pane or folder to add the folder to.
 * @param initial The seeds, locks and palette to display initially.
 * @param onChange Called with the new field values when the user edits any field.
 * @returns A handle to update the folder when the seeds change outside of the folder.
 */
export const addSeedFolder = (
	container: PaneContainer,
	initial: SeedDisplay,
	onChange: (edit: SeedEdit) => void,
): SeedFolderHandle => {
	const folder = container.addFolder({ title: 'Seeds', expanded: false });
	const seeds = { image: initial.image, color: initial.color };

	let updating = false;
	let imageLock: HTMLInputElement;
	let colorLock: HTMLInputElement;
	const notify = (): void => {
		if (!updating) {
			onChange({
				image: seeds.image,
				color: seeds.color,
				imageLocked: imageLock.checked,
				colorLocked: colorLock.checked,
			});
		}
	};

	const imageBinding = folder.addBinding(seeds, 'image', { label: 'Image' });
	const colorBinding = folder.addBinding(seeds, 'color', { label: 'Color' });
	imageBinding.on('change', notify);
	colorBinding.on('change', notify);
	imageLock = addLockCheckbox(imageBinding, notify);
	colorLock = addLockCheckbox(colorBinding, notify);
	imageLock.checked = initial.imageLocked;
	colorLock.checked = initial.colorLocked;

	const swatchWrapper = document.createElement('div');
	swatchWrapper.className = 'sketch-swatches';
	folder.element.querySelector('.tp-fldv_c')?.append(swatchWrapper);
	const renderSwatches = (colors: string[]): void => {
		swatchWrapper.replaceChildren(
			...colors.map((color) => {
				const swatch = document.createElement('div');
				swatch.className = 'sketch-swatch';
				swatch.style.backgroundColor = color;
				return swatch;
			}),
		);
	};
	renderSwatches(initial.swatches);

	return {
		update: (display) => {
			updating = true;
			seeds.image = display.image;
			seeds.color = display.color;
			imageBinding.refresh();
			colorBinding.refresh();
			imageLock.checked = display.imageLocked;
			colorLock.checked = display.colorLocked;
			updating = false;
			renderSwatches(display.swatches);
		},
	};
};
