import { Canvas } from '@code-not-art/core';
import querystring from 'query-string';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ControlPanel } from '../control-panel/ControlPanel.js';
import { initialControlPanelValues } from '../control-panel/Parameters.js';
import type {
	ControlPanelConfig,
	ControlPanelElements,
	ControlPanelParameterValues,
} from '../control-panel/types/controlPanel.js';
import { SketchDefinition, SketchProps } from '../sketch/index.js';
import KeyboardHandler from './KeyboardHandler.js';
import { MOBILE_WIDTH_BREAKPOINT } from './constants.js';
import { exportFilename, exportPng, exportSvg } from './export.js';
import type { SectionValues } from './control-panel/buildPane.js';
import { FixedPositionWrapper } from './control-panel/FixedPositionWrapper.js';
import { TweakpaneControlPanel } from './control-panel/TweakpaneControlPanel.js';
import ControlButtons from './controls/index.js';
import {
	applyQuery,
	getParamsFromQuery,
	QUERY_STRING_USER_COLOR_SEED,
	QUERY_STRING_USER_IMAGE_SEED,
	setUrlQueryFromState,
} from './share.js';
import { ImageState, LoopState } from './state/index.js';

// TODO: separate sketch init into a wrapper component so that the sketchData wrapper can be passed as a prop so we are confident we always have data.
// this allows us to get rid of the `as TDataModel` casting.

const DEFAULT_MENU_DELAY = 25;

type SketchControllerProps<TControlPanel extends ControlPanelElements, TDataModel extends object> = {
	canvasId: string;
	sketch: SketchDefinition<TControlPanel, TDataModel>;
	initialParameters?: Partial<NoInfer<TDataModel>>;
	seeds?: Partial<{ initialSeed: string; imageSeed: string; paletteSeed: string }>;
	config?: Partial<{
		enableControls: boolean;
		showControlPanel: boolean;
	}>;
};
export const SketchController = <TParameters extends ControlPanelElements, TDataModel extends object>({
	canvasId,
	sketch,
	initialParameters,
	seeds,
	config: controlllerConfig,
}: SketchControllerProps<TParameters, TDataModel>) => {
	const { enableControls, showControlPanel } = controlllerConfig || {};

	const config = sketch.config;

	const query = querystring.parse(location.search);
	const queryString = typeof query.p === 'string' ? query.p : '';
	const queryStringParamValues = getParamsFromQuery(queryString);

	const [renderTime, updateState] = React.useState<Date>(new Date());
	const forceUpdate = React.useCallback(() => updateState(new Date()), []);

	const [initialized, setInitialized] = useState<boolean>(false);
	const [showMenu, setShowMenu] = useState<boolean>(true);
	const toggleMenu = () => setShowMenu(!showMenu);

	// All these state variables could just be local references, except they would get wiped during hotload.
	// By stashing them in state, they keep their values as the developer edits their sketch.
	const [state] = useState<ImageState>(
		() =>
			new ImageState({
				seed: seeds?.initialSeed || config.seed,
				imageSeed: seeds?.imageSeed,
				colorSeed: seeds?.paletteSeed,
				paletteType: config.paletteType,
				userImageSeed: queryStringParamValues[QUERY_STRING_USER_IMAGE_SEED],
				userPaletteSeed: queryStringParamValues[QUERY_STRING_USER_COLOR_SEED],
			}),
	);

	const controlsConfig = useMemo(() => ControlPanel('Sketch Parameters', sketch.controls), []);
	type ControlValues = ControlPanelParameterValues<typeof controlsConfig>;
	type EventHandlers = Partial<{
		resize: (this: Window, ev: UIEvent) => any;
		keydown: (event: KeyboardEvent) => void;
		touchend: (event: TouchEvent) => void;
	}>;

	const [eventHandlers] = useState<EventHandlers>({}); // TODO: strictly type the handlers

	const [params, setParams] = useState<{ data: ControlValues }>(() => {
		return {
			data: {
				...initialControlPanelValues(controlsConfig),
				...queryStringParamValues,
				...initialParameters,
			},
		};
	});
	const [loopState] = useState<LoopState>(new LoopState());

	// Redraw bookkeeping, see `redraw`
	const redrawCount = useRef<number>(0);
	const pendingRedraw = useRef<Promise<void>>(Promise.resolve());

	// The Canvas wrapper is reused so that state it holds, such as the SVG source available for export, persists.
	const canvasWrapper = useRef<Canvas | undefined>(undefined);

	const getCanvas = (): Canvas => {
		// Grab our canvas
		const pageCanvas = document.getElementById(canvasId);
		if (pageCanvas instanceof HTMLCanvasElement) {
			if (canvasWrapper.current?.canvas !== pageCanvas) {
				canvasWrapper.current = new Canvas(pageCanvas);
			}
			return canvasWrapper.current;
		}

		// We did not find a canvas where expected, throw an error instead.
		// TODO: System to communicate that the canvas was not available to the sketch.
		if (pageCanvas === null) {
			throw new Error(`Cannot render Sketch, Canvas with id '${canvasId}' is not found.`);
		}
		throw new Error(`Cannot render Sketch, element with the expected id '${canvasId}' is not an HTML Canvas.`);
	};

	const getSketchProps: () => SketchProps<ControlPanelConfig<TParameters>> = () => {
		return {
			canvas: getCanvas(),
			palette: state.getPalette(),
			params: params.data,
			rng: state.getRng(),
		};
	};

	const [sketchData] = useState<{ data: TDataModel | undefined }>({
		data: undefined,
	});
	const setSketchData = (data: TDataModel) => {
		sketchData.data = data;
		forceUpdate();
	};

	const resize = () => {
		const canvasAspectRatio = config.width / config.height;

		// For quick mobile sizing solution:
		const useHalfScreen = window.innerWidth <= MOBILE_WIDTH_BREAKPOINT;

		const windowWidth = window.innerWidth;
		const windowHeight = useHalfScreen ? window.innerHeight / 2 : window.innerHeight;
		const windowAspectRatio = windowWidth / windowHeight;

		let newHeight = config.height;
		let newWidth = config.width;

		// Always render the canvas within the dimensions of the window
		if (windowAspectRatio > canvasAspectRatio) {
			const maxDim = windowHeight - 30;
			if (config.height > maxDim) {
				newHeight = maxDim;
				newWidth = (newHeight / config.height) * config.width;
			}
		} else {
			const maxDim = windowWidth - 30;
			if (config.width > maxDim) {
				newWidth = maxDim;
				newHeight = (newWidth / config.width) * config.height;
			}
		}
		const canvas = getCanvas();
		canvas.canvas.style.height = newHeight + 'px';
		canvas.canvas.style.width = newWidth + 'px';
	};

	/**
	 * Redraw triggers the sketch to run for every time after the initial draw
	 * This runs the sketch.reset() code before the draw() function. It also restarts the animation loop.
	 * The react state is forced to update to get the menu to re-render with the new sketch props.
	 */
	const redraw = async (): Promise<void> => {
		// Sketch reset and draw may be async (e.g. rendering an SVG). Redraws run one at a time, so a slow draw can never
		// paint onto the canvas after a newer redraw has cleared it. If more redraws are requested while one is running,
		// only the most recent one runs.
		redrawCount.current += 1;
		const redrawId = redrawCount.current;
		await pendingRedraw.current;
		if (redrawId !== redrawCount.current) {
			return;
		}

		pendingRedraw.current = runRedraw().catch((error) => {
			console.error('Sketch failed to render', error);
		});
		await pendingRedraw.current;
	};

	const runRedraw = async (): Promise<void> => {
		state.restartRng();
		const sketchProps = getSketchProps();

		const updatedSketchData = await sketch.reset(
			sketchProps,
			sketchData.data as TDataModel, // TODO: check that this isn't undefined
		);
		setSketchData(updatedSketchData);

		await draw();
		loopState.restart();
		// Re-render so the export menu reflects whether this draw produced an SVG
		forceUpdate();
	};

	const draw = async (): Promise<void> => {
		// Set dimensions for window
		resize();
		const sketchProps = getSketchProps();
		// Note: This size update is done pre-draw based on config props for the size.
		//      when this is run, the canvas bitmap content is lost, so do not do this in the resize loop.
		sketchProps.canvas.set.size(config.width, config.height);

		state.startRender();
		try {
			// Dangerous casting, requires that we are confident the init pass has completed by this point
			if (sketchData.data !== undefined) {
				await sketch.draw(getSketchProps(), sketchData.data);
			}
		} finally {
			state.stopRender();
		}

		if (loopState.animationFrameRequest) {
			window.cancelAnimationFrame(loopState.animationFrameRequest);
		}

		const animate = () => {
			if (loopState.nextFrame()) {
				loopState.finished = sketch.loop(getSketchProps(), sketchData.data as TDataModel, loopState.frameData);
			}
			loopState.animationFrameRequest = window.requestAnimationFrame(animate);
		};
		animate();
	};

	const download = () => {
		const filename = exportFilename({ image: state.getImage(), color: state.getColor(), extension: 'png' });
		exportPng(getCanvas().canvas, filename).catch((error) => {
			console.error('Failed to export PNG', error);
		});
	};

	const downloadSvg = () => {
		const svg = getCanvas().svg.source();
		if (svg === undefined) {
			console.log('No SVG to export, the sketch has not drawn an SVG.');
			return;
		}
		exportSvg(svg, exportFilename({ image: state.getImage(), color: state.getColor(), extension: 'svg' }));
	};

	const onStateChange = () => {
		state.restartRng();
		setUrlQueryFromState(state, params.data);
		// forceUpdate();
	};

	// ===== Event Handlers =====
	// They all need to be removed before being re-attached or crazy duplicates happen
	// They also need to be reattached when the params change since the original listeners have those params in their internal scope
	const resetEventHandlers = () => {
		// ===== Remove previous hanndlers
		removeEventHandlers;

		// ===== Window Resize
		eventHandlers.resize = function () {
			resize();
		};
		window.addEventListener('resize', eventHandlers.resize, true);

		// ===== Keydown
		if (enableControls) {
			eventHandlers.keydown = (event: KeyboardEvent) => {
				KeyboardHandler({
					state,
					loopState,
					params: params.data,
					onStateChange,
					redraw,
					download,
					downloadSvg,
					toggleMenu,
				})(event);
			};
			document.addEventListener('keydown', eventHandlers.keydown, false);
		}

		// ===== Touch Screen Press on Canvas
		if (enableControls) {
			eventHandlers.touchend = (event: TouchEvent) => {
				if (event.target && (event.target as HTMLElement).localName !== 'canvas') {
					// Ignore any touch not on the canvas
					return;
				}
				state.random();
				redraw();
			};
			document.addEventListener('touchend', eventHandlers.touchend, false);
		}
	};

	const removeEventHandlers = () => {
		eventHandlers.resize && window.removeEventListener('resize', eventHandlers.resize);
		eventHandlers.keydown && document.removeEventListener('keydown', eventHandlers.keydown);
		eventHandlers.touchend && document.removeEventListener('touchend', eventHandlers.touchend);
	};

	const controlPanelUpdateHandler = (newValues: SectionValues) => {
		// The control panel builds its values from `controlsConfig` and starts from `params.data`, so they have the shape
		// of `ControlValues`. TypeScript cannot see this through the untyped Tweakpane bindings.
		params.data = newValues as ControlValues;
		setUrlQueryFromState(state, params.data);
		redraw();
	};
	const seedMenuUpdateHandler = (updatedState: { image: string; color: string }): void => {
		state.setUserImage(updatedState.image);
		state.setUserColor(updatedState.color);
		setUrlQueryFromState(state, params.data);
		state.restartRng();
		redraw();
	};

	/**
	 * Run on page load, hot reload, and every state update
	 * This triggers draw, so forcing state update will cause the sketch to draw
	 */
	useEffect(() => {
		// ===== Reset event handlers whenever hot load or state change occurs
		resetEventHandlers();

		// ===== Run once only
		if (!initialized) {
			console.log('### ===== Sketch! ===== ###');
			// ===== Initialize Sketch

			const query = querystring.parse(location.search);
			if (typeof query.p === 'string') {
				applyQuery(query.p, state, params.data);
			}
			state.restartRng();

			resize();
			getCanvas().set.size(config.width, config.height);
			const initData = sketch.init(getSketchProps());
			setSketchData(initData);
			setInitialized(true);
			redraw();
		}
		return () => {
			removeEventHandlers();
		};
	});

	return (
		<>
			<FixedPositionWrapper vertical="top" horizontal="right">
				{showControlPanel && (
					<TweakpaneControlPanel
						config={controlsConfig}
						initialValues={params.data}
						visible={showMenu}
						changeDelay={config.menuDelay !== undefined ? config.menuDelay : DEFAULT_MENU_DELAY}
						onParametersChange={controlPanelUpdateHandler}
						seeds={{
							image: state.getImage(),
							color: state.getColor(),
							swatches: state.palette.colors.slice(0, 5).map((color) => color.rgb()),
						}}
						onSeedsChange={seedMenuUpdateHandler}
						hasSvg={canvasWrapper.current?.svg.source() !== undefined}
						onExportPng={download}
						onExportSvg={downloadSvg}
					/>
				)}
			</FixedPositionWrapper>
			{window.innerWidth <= MOBILE_WIDTH_BREAKPOINT &&
				useMemo(
					() => (
						<ControlButtons
							state={state}
							loopState={loopState}
							params={params.data}
							draw={redraw}
							download={download}
							videoControls={!!sketch.config.enableLoopControls}
						/>
					),
					[renderTime],
				)}
		</>
	);
};
