import { Vec2 } from '@code-not-art/core';
import {
  SketchDraw,
  SketchInit,
  SketchLoop,
  SketchReset,
} from '../sketch/Sketch.js';
import { repeat } from '../../../core/dist/utils/arrays.js';
import { Parameters } from '../control-panel/Parameters.js';
import type { ControlPanelElement } from '../control-panel/types/controlPanel.js';
import { Sketch, SketchConfig } from '../index.js';

const config = SketchConfig({ menuDelay: 10 });

const controls = {
  radius: Parameters.number({ label: 'Radius', initialValue: 0.5, min: 0.1 }),
  offset: Parameters.number({ label: 'Offset' }),
  alpha: Parameters.number({ label: 'Alpha', initialValue: 0.3 }),
  circles: Parameters.number({
    label: 'Circles',
    initialValue: 5,
    min: 2,
    step: 1,
  }),
  thing: Parameters.string({ label: 'asdf' }),
} satisfies Record<string, ControlPanelElement<any>>;

const data = {};

type SketchControls = typeof controls;
type SketchData = typeof data;

/**
 * Init is run once on startup, but then not again until the page is refreshed.
 * This can be used for any programatic setup that needs RNG or other sketch properties and that should only ever be run once.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const init: SketchInit<SketchControls, SketchData> = ({ rng }) => {
  console.log('Initializing Sketch...');

  return {};
};

/**
 * Reset does not run the first time the sketch is drawn, instead it is run between redraws of the sketch.
 * This can be used to reset the data in the sketch props that is passed to the draw and loop methods, or other setup tasks.
 * Note that the canvas is not cleared by default, but can be done here or at the start of hte draw method.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const reset: SketchReset<SketchControls, SketchData> = () => {
  console.log('Resetting Sketch...');
  return {};
};

/**
 * Runs once for the sketch, after data initialization and before the animation loop begins.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 */
const draw: SketchDraw<SketchControls, SketchData> = ({
  canvas,
  palette,
  params,
  rng,
}) => {
  console.log('Drawing Sketch...');
  // Random canvas background color
  canvas.fill('white');
  // canvas.fill(palette.colors[0]);

  // Your sketch instructions here:
  // ...
  const colors = Math.floor(params.circles);
  repeat(colors, (index) => {
    canvas.draw.circle({
      // center: Vec2.zero().add(canvas.get.size().scale(index / 3)),
      center: canvas.get
        .center()
        .add(
          canvas.get
            .size()
            .scale((index - (colors - 1) / 2) / colors)
            .scale(params.offset),
        )
        .add(Vec2.unit().scale(-200)),
      radius: (params.radius * canvas.get.width()) / 2,
      fill: palette.rng.color().set.alpha(params.alpha),
    });
  });
  repeat(colors, (index) => {
    canvas.draw.circle({
      // center: Vec2.zero().add(canvas.get.size().scale(index / 3)),
      center: canvas.get
        .center()
        .add(
          canvas.get
            .size()
            .scale((index - (colors - 1) / 2) / colors)
            .scale(params.offset),
        )
        .add(Vec2.unit().scale(200)),
      radius: (params.radius * canvas.get.width()) / 2,
      fill: rng.color().set.alpha(params.alpha),
    });
  });
};

/**
 * Repeats on every available animation frame. Attemtps to render on every 1/60th of a second but the frame data will provide specific timing data if frame windows are missed.
 * @param sketchProps Access to canvas context, RNG, color pallete, parameter values, and persistent data
 * @param frameData Frame count, and time since last frame was drawn.
 * @returns return value indicates if the loop is complete: return true when finished. This will be called repeatedly so long as it returns false.
 */
const loop: SketchLoop<SketchControls, SketchData> = ({}, _data, { frame }) => {
  console.log(`Sketch animation loop, frame ${frame} ...`);

  // Your sketch animation instructions here:
  // ...

  // return true when loop is complete, return false to continue running loop every animation frame
  return true;
};

export default Sketch<SketchControls, SketchData>({
  config,
  controls,
  init,
  draw,
  loop,
  reset,
});
