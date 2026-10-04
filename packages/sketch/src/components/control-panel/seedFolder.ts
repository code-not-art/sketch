import type { PaneContainer } from './buildPane.js';

/**
 * The seed values and palette shown in the Seeds folder.
 */
export type SeedDisplay = {
	/** Seed that determines the image random number generator. */
	image: string;
	/** Seed that determines the palette. */
	color: string;
	/** CSS colors of the current palette, shown as swatches. */
	swatches: string[];
};

/**
 * Controls for updating an existing Seeds folder.
 */
export type SeedFolderHandle = {
	/**
	 * Replaces the displayed seeds and palette without calling the change handler.
	 */
	update: (display: SeedDisplay) => void;
};

/**
 * Adds a collapsed "Seeds" folder with text fields for the image and color seeds, and swatches for the current palette.
 *
 * @param container The pane or folder to add the folder to.
 * @param initial The seeds and palette to display initially.
 * @param onChange Called with the new seed values when the user edits either field.
 * @returns A handle to update the folder when the seeds change outside of the folder.
 */
export const addSeedFolder = (
	container: PaneContainer,
	initial: SeedDisplay,
	onChange: (seeds: { image: string; color: string }) => void,
): SeedFolderHandle => {
	const folder = container.addFolder({ title: 'Seeds', expanded: false });
	const seeds = { image: initial.image, color: initial.color };

	let updating = false;
	const imageBinding = folder.addBinding(seeds, 'image', { label: 'Image' });
	const colorBinding = folder.addBinding(seeds, 'color', { label: 'Color' });
	for (const binding of [imageBinding, colorBinding]) {
		binding.on('change', () => {
			if (!updating) {
				onChange({ image: seeds.image, color: seeds.color });
			}
		});
	}

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
			updating = false;
			renderSwatches(display.swatches);
		},
	};
};
