import {
  ParameterModel,
  SketchDraw,
  SketchInit,
  SketchLoop,
  SketchReset,
} from 'sketch/Sketch.js';
import { FrameData, Params, Sketch, SketchConfig } from '../index.js';

const config = SketchConfig({});

const params = {
  customOptions: Params.header('Custom Options'),
} satisfies ParameterModel;
const data = {};

type SketchParams = typeof params;
type SketchData = typeof data;

/**
 * Init is run once on startup, but then not again until the page is refreshed.
 * This can be used for any programatic setup that needs RNG or other sketch properties and that should only ever be run once.
 * @param {SketchProps} sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const init: SketchInit<SketchParams, SketchData> = () => {
  console.log('Initializing Sketch...');
  return {};
};

/**
 * Reset does not run the first time the sketch is drawn, instead it is run between redraws of the sketch.
 * This can be used to reset the data in the sketch props that is passed to the draw and loop methods, or other setup tasks.
 * Note that the canvas is not cleared by default, but can be done here or at the start of hte draw method.
 * @param {SketchProps} sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const reset: SketchReset<SketchParams, SketchData> = () => {
  console.log('Resetting Sketch...');
  return {};
};

/**
 * Runs once for the sketch, after data initialization and before the animation loop begins.
 * @param {SketchProps} sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const draw: SketchDraw<SketchParams, SketchData> = ({ canvas, palette }) => {
  console.log('Drawing Sketch...');

  // Random canvas background color
  canvas.fill(palette.colors[0]);

  // Your sketch instructions here:
  // ...
};

/**
 * Repeats on every available animation frame. Attemtps to render on every 1/60th of a second but the frame data will provide specific timing data if frame windows are missed.
 * @param {SketchProps} sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 * @param {FrameData} frameData Frame count, and time since last frame was drawn.
 * @returns {boolean} return value indicates if the loop is complete: return true when finished. This will be called repeatedly so long as it returns false.
 */
const loop: SketchLoop<SketchParams, SketchData> = ({}, _data, { frame }) => {
  console.log(`Sketch animation loop, frame ${frame} ...`);

  // Your sketch animation instructions here:
  // ...

  // return true when loop is complete, return false to continue running loop every animation frame
  return true;
};

export default Sketch<typeof params, typeof data>({
  config,
  params,
  init,
  draw,
  loop,
  reset,
});
