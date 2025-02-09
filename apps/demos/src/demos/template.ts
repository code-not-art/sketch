import { Constants, Utils } from '@code-not-art/core';
import {
	type ControlPanelElements,
	createSketch,
	createSketchConfig,
	type SketchDraw,
	type SketchInit,
	SketchLoop,
	SketchReset,
} from '@code-not-art/sketch';

const { array, repeat } = Utils;
const { TAU } = Constants;

const config = createSketchConfig({
	menuDelay: 0,
});

const controls = {} satisfies ControlPanelElements;

type CustomControls = typeof controls;
type CustomData = {};

/**
 * Init is run once on startup to initialize the values of the sketch data.
 * Since init is only run once, when the sketch is first loaded, this can be used to run any calculations that are slow and you don't want to repeat on redraw.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const init: SketchInit<CustomControls, CustomData> = (props) => {
	console.log('Initializing Sketch...');
	const initialData: CustomData = {};
	return initialData;
};

/**
 * Reset does not run the first time the sketch is drawn, instead it is run between redraws of the sketch.
 * This can be used to reset the data in the sketch props that is passed to the draw and loop methods.
 * The current data state is provided, so if you want to persist any data from one drawing to the next redraw you can configure that here.
 *
 * Note that there is a default reset function that will be run if you do not provide a custom reset. That reset function will clear the canvas and persist the previous drawing's data.
 * If you want to modify the persistent data or prevent the clear from running you should provide your own reset.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const reset: SketchReset<CustomControls, CustomData> = (props, data) => {
	console.log('Resetting Sketch...');
	const resetData: CustomData = {};
	return resetData;
};

/**
 * Runs once for the sketch, after data initialization and before the animation loop begins.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const draw: SketchDraw<CustomControls, CustomData> = ({ canvas, palette, params, rng }, _data) => {
	console.log('Drawing Sketch...');

	// Your sketch instructions here:
	// ...
};

/**
 * Repeats on every available animation frame. Attemtps to render on every 1/60th of a second but the frame data will provide specific timing data if frame windows are missed.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 * @param frameData Frame count, and time since last frame was drawn.
 * @returns return value indicates if the loop is complete: return true when finished. This will be called repeatedly so long as it returns false.
 */
const loop: SketchLoop<CustomControls, CustomData> = ({}, _data, { frame }) => {
	console.log(`Sketch animation loop, frame ${frame} ...`);

	// Your sketch animation instructions here:
	// ...

	// return true when loop is complete, return false to continue running loop every animation frame
	return true;
};

export default createSketch<CustomControls, CustomData>({
	config,
	controls,
	init,
	draw,
	loop,
	reset,
});

const exampleSketch = createSketch({
	init: () => ({}),
	controls: {},
});
