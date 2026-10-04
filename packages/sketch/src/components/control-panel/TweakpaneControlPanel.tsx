import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { cloneDeep, debounce } from 'lodash';
import { useEffect, useRef, type ReactElement } from 'react';
import { styled } from 'styled-components';
import { Pane } from 'tweakpane';
import type { ControlPanelConfig, ControlPanelElements } from '../../control-panel/types/controlPanel.js';
import { addControlPanelElements, type SectionValues } from './buildPane.js';
import { addExportFolder, type ExportFolderHandle } from './exportFolder.js';
import { addSeedFolder, type SeedDisplay, type SeedFolderHandle } from './seedFolder.js';

/**
 * Hosts the Tweakpane pane. The `--tp-*` variables restyle Tweakpane to the dark, amber accented look used by the
 * sketch menu. The remaining rules style the elements added to the pane by this package.
 */
const ThemedPaneHost = styled.div`
	--tp-base-background-color: rgb(35, 35, 35);
	--tp-base-border-radius: 0;
	--tp-base-font-family: monospace;
	--tp-base-shadow-color: rgba(0, 0, 0, 0.4);
	--tp-container-background-color: rgba(255, 255, 255, 0.04);
	--tp-container-background-color-hover: rgba(255, 255, 255, 0.08);
	--tp-container-background-color-focus: rgba(251, 191, 36, 0.15);
	--tp-container-background-color-active: rgba(251, 191, 36, 0.25);
	--tp-container-foreground-color: rgb(170, 170, 170);
	--tp-label-foreground-color: rgb(235, 235, 235);
	--tp-input-background-color: black;
	--tp-input-background-color-hover: rgb(20, 20, 20);
	--tp-input-background-color-focus: rgb(30, 30, 30);
	--tp-input-background-color-active: rgb(40, 40, 40);
	--tp-input-foreground-color: rgb(235, 235, 235);
	--tp-button-background-color: #464646;
	--tp-button-background-color-hover: #565656;
	--tp-button-background-color-focus: #fbbf24;
	--tp-button-background-color-active: #f59e0b;
	--tp-button-foreground-color: #fbbf24;
	--tp-monitor-background-color: black;
	--tp-monitor-foreground-color: rgb(170, 170, 170);
	--tp-groove-foreground-color: rgba(255, 255, 255, 0.1);
	--tp-blade-value-width: 55%;

	.tp-fldv_b {
		text-transform: uppercase;
		font-size: 0.7rem;
	}
	.tp-sldv_k::before,
	.tp-sldv_k::after {
		background-color: #fbbf24;
	}
	.sketch-section-description {
		padding: 0.25rem 0.5rem;
		color: rgb(170, 170, 170);
		line-height: 1.3;
	}
	.sketch-swatches {
		display: flex;
		height: 2rem;
		margin-top: var(--cnt-usp, 4px);
	}
	.sketch-swatch {
		flex: 1;
	}
`;

/**
 * Props for `TweakpaneControlPanel`.
 */
export type TweakpaneControlPanelProps = {
	/** The sketch's control panel definition, rendered as the "Sketch Parameters" folder. */
	config: ControlPanelConfig<ControlPanelElements>;
	/**
	 * Parameter values the controls start with. Only read when the pane is first created; the panel then tracks the
	 * values itself.
	 */
	initialValues: SectionValues;
	/** When `false`, the whole panel is hidden. */
	visible: boolean;
	/** Milliseconds to wait after the last parameter edit before calling `onParametersChange`. */
	changeDelay: number;
	/** Called, after `changeDelay`, with a copy of all parameter values whenever the user edits a parameter. */
	onParametersChange: (values: SectionValues) => void;
	/** The seeds and palette to display. The panel updates to match whenever these change. */
	seeds: SeedDisplay;
	/** Called when the user edits the image or color seed. */
	onSeedsChange: (seeds: { image: string; color: string }) => void;
	/** Whether the sketch has drawn an SVG that can be exported. */
	hasSvg: boolean;
	/** Called when the user presses the PNG export button. */
	onExportPng: () => void;
	/** Called when the user presses the SVG export button. */
	onExportSvg: () => void;
};

/**
 * Renders the sketch menu as a Tweakpane pane with collapsible Seeds, Export and parameter sections. Fill the
 * available space of its parent, for example inside `FixedPositionWrapper`.
 *
 * Parameter controls are created once from `config`; later changes to `config` or `initialValues` are ignored. The
 * seeds, palette, SVG availability and visibility follow their props. Callback props may change on every render.
 */
export const TweakpaneControlPanel = (props: TweakpaneControlPanelProps): ReactElement => {
	const hostRef = useRef<HTMLDivElement>(null);
	const seedFolderRef = useRef<SeedFolderHandle | undefined>(undefined);
	const exportFolderRef = useRef<ExportFolderHandle | undefined>(undefined);
	const paneRef = useRef<Pane | undefined>(undefined);

	// Callbacks are read through a ref so the pane, created once, always calls the latest ones.
	const latestProps = useRef(props);
	latestProps.current = props;

	/**
	 * Creates the Tweakpane pane and all of its folders when the component mounts, and disposes of it when the
	 * component unmounts. It does not re-run, because parameter controls own their values after creation.
	 */
	useEffect(() => {
		if (!hostRef.current) {
			return;
		}
		const pane = new Pane({ container: hostRef.current });
		pane.registerPlugin(EssentialsPlugin);

		const current = latestProps.current;
		seedFolderRef.current = addSeedFolder(pane, current.seeds, (seeds) => latestProps.current.onSeedsChange(seeds));
		exportFolderRef.current = addExportFolder(
			pane,
			current.hasSvg,
			() => latestProps.current.onExportPng(),
			() => latestProps.current.onExportSvg(),
		);

		const values = cloneDeep(current.initialValues);
		const notifyParametersChange = debounce(
			() => latestProps.current.onParametersChange(cloneDeep(values)),
			current.changeDelay,
		);
		const parametersFolder = pane.addFolder({
			title: current.config.title,
			expanded: !current.config.startCollapsed,
		});
		addControlPanelElements(parametersFolder, current.config, values, notifyParametersChange);

		paneRef.current = pane;
		return () => {
			notifyParametersChange.cancel();
			pane.dispose();
			paneRef.current = undefined;
			seedFolderRef.current = undefined;
			exportFolderRef.current = undefined;
		};
	}, []);

	/**
	 * Copies the seeds, palette and SVG availability into the pane. Runs after every render, because the seeds can
	 * change through keyboard shortcuts and the SVG is only available after a draw completes.
	 */
	useEffect(() => {
		seedFolderRef.current?.update(props.seeds);
		exportFolderRef.current?.setSvgAvailable(props.hasSvg);
	});

	/**
	 * Shows or hides the pane when `visible` changes.
	 */
	useEffect(() => {
		if (paneRef.current) {
			paneRef.current.hidden = !props.visible;
		}
	}, [props.visible]);

	return <ThemedPaneHost ref={hostRef} />;
};
