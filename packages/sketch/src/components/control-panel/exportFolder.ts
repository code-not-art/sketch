import { ButtonGridApi } from '@tweakpane/plugin-essentials';
import type { PaneContainer } from './buildPane.js';

const EXPORT_BUTTON_TITLES = ['PNG', 'SVG'] as const;

/**
 * Controls for updating an existing Export folder.
 */
export type ExportFolderHandle = {
	/**
	 * Enables or disables the SVG button. The button is only usable when the sketch has drawn an SVG.
	 */
	setSvgAvailable: (available: boolean) => void;
};

/**
 * Adds a collapsed "Export" folder with buttons to export the current image as PNG or SVG.
 *
 * @param container The pane or folder to add the folder to. It must have the `@tweakpane/plugin-essentials` plugin
 * registered.
 * @param hasSvg Whether the sketch has drawn an SVG. The SVG button starts disabled when `false`.
 * @param onExportPng Called when the PNG button is pressed.
 * @param onExportSvg Called when the SVG button is pressed.
 * @returns A handle to update the folder as the SVG availability changes.
 * @throws If the essentials plugin is not registered.
 */
export const addExportFolder = (
	container: PaneContainer,
	hasSvg: boolean,
	onExportPng: () => void,
	onExportSvg: () => void,
): ExportFolderHandle => {
	const folder = container.addFolder({ title: 'Export', expanded: false });
	const buttons = folder.addBlade({
		view: 'buttongrid',
		size: [EXPORT_BUTTON_TITLES.length, 1],
		cells: (column: number) => ({ title: EXPORT_BUTTON_TITLES[column] }),
	});
	if (!(buttons instanceof ButtonGridApi)) {
		throw new Error('The Tweakpane essentials plugin must be registered to render the export buttons.');
	}
	buttons.on('click', (event) => {
		const [column] = event.index;
		if (EXPORT_BUTTON_TITLES[column] === 'PNG') {
			onExportPng();
		} else {
			onExportSvg();
		}
	});

	const setSvgAvailable = (available: boolean): void => {
		const svgButton = buttons.cell(1, 0);
		if (svgButton) {
			svgButton.disabled = !available;
		}
	};
	setSvgAvailable(hasSvg);
	return { setSvgAvailable };
};
