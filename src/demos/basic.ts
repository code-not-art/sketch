import {
  Color,
  Utils,
  Vec2,
  grid,
  type FillSelection,
  type Stroke,
} from '@code-not-art/core';
import {
  ControlPanel,
  MultiSelectUtils,
  Parameters,
  Sketch,
  SketchConfig,
  SketchDraw,
  SketchInit,
  SketchLoop,
  SketchReset,
  type ControlPanelElements,
} from '../index.js';

const { array, clamp, repeat } = Utils;

const config = SketchConfig({
  menuDelay: 5,
});

type Shape = 'circle' | 'square' | 'cross';

const controls = {
  gridSize: Parameters.number({
    label: 'Grid Size',
    initialValue: 15,
    min: 5,
    max: 100,
    step: 1,
  }),
  colors: ControlPanel('Colors', {
    baseHue: Parameters.number({ label: 'Hue', min: 1, max: 360, step: 1 }),
    hueRange: Parameters.number({
      label: 'Color Range',
      initialValue: 0.425,
    }),
    saturation: Parameters.number({
      label: 'Saturation',
      min: 1,
      max: 100,
      step: 1,
      initialValue: 48,
    }),
  }),
  markers: ControlPanel('Markers', {
    scaleRange: Parameters.number({
      label: 'Scale Range',
      initialValue: 0.4,
    }),
    fillChance: Parameters.number({
      label: 'Fill Chance',
      initialValue: 0.333,
    }),
    missingChance: Parameters.number({
      label: 'Missing Chance',
      initialValue: 0.1,
    }),
    shapes: Parameters.multiSelect<Shape>({
      label: 'Shapes',
      options: ['circle', 'square', 'cross'],
      initialValue: { circle: true, cross: true, square: true },
    }),
  }),
} satisfies ControlPanelElements;

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
const draw: SketchDraw<CustomControls, CustomData> = (
  { canvas, palette, params, rng },
  _data,
) => {
  console.log('Drawing Sketch...');

  const {
    colors: { baseHue, hueRange, saturation },
    gridSize,
    markers: { fillChance, missingChance, scaleRange, shapes },
  } = params;

  const hueClamp = (input: number) => clamp(input, { min: 1, max: 360 });

  const minDim = canvas.get.minDim();
  const background = new Color('#111');

  // const baseHue = palette.rng.int(0, 360);
  const minHue = hueClamp((baseHue + 360 - (360 * hueRange) / 2) % 361);

  const lightColors = [
    ...array(8).map(
      (index) =>
        new Color({
          h: hueClamp((minHue + ((360 * hueRange) / 7) * index) % 360),
          s: saturation,
          v: 100,
        }),
    ),
  ];

  const shapesOptions: Shape[] = MultiSelectUtils.selected(shapes);

  // Random canvas background color
  canvas.fill(background);

  const drawMarker = (config: { location: Vec2; scale?: number }) => {
    const radius = (canvas.get.minDim() / 100) * (config.scale || 1);

    const strokeWidth = minDim / 200;
    let fill: FillSelection | undefined = undefined;
    let stroke: Stroke | undefined = undefined;

    stroke = {
      color: palette.rng.chooseOne(lightColors),
      width: strokeWidth,
    };
    palette.rng.push('fill');
    if (rng.next() < fillChance) {
      fill = palette.rng.chooseOne(lightColors);
    }
    palette.rng.pop();

    const shape = rng.chooseOne(shapesOptions);
    const rotation = rng.next();
    if (rng.next() >= missingChance) {
      canvas.transform.push();
      canvas.transform.translate(config.location);
      canvas.transform.rotate((rotation * Math.PI) / 2);
      switch (shape) {
        case 'circle': {
          canvas.draw.circle(
            {
              center: Vec2.zero(),
              radius: radius,
            },
            {
              fill,
              stroke,
            },
          );
          break;
        }
        case 'square': {
          canvas.draw.rect(
            {
              corner: Vec2.ones().scale(-radius),
              height: radius * 2,
              width: radius * 2,
            },
            {
              fill,
              stroke,
            },
          );

          break;
        }
        case 'cross':
          {
            canvas.draw.line(
              {
                start: Vec2.unit().scale(-radius),
                end: Vec2.unit().scale(radius),
              },
              { stroke },
            );
            canvas.draw.line(
              {
                start: Vec2.unit()
                  .rotate(Math.PI / 2)
                  .scale(-radius),
                end: Vec2.unit()
                  .rotate(Math.PI / 2)
                  .scale(radius),
              },
              { stroke: fill && stroke ? { ...stroke, color: fill } : stroke },
            );
          }
          break;
      }
      canvas.transform.pop();
    }
  };

  const points = grid({ columns: gridSize, rows: gridSize });
  const shuffledPoints = rng.shuffle(points);
  shuffledPoints.forEach((tile) => {
    drawMarker({
      location: Vec2.ones().scale(tile.uv).scale(canvas.get.size()),
      scale: rng.fuzzy(1).float(scaleRange),
    });
  });
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

export default Sketch<CustomControls, CustomData>({
  config,
  controls,
  init,
  draw,
  loop,
  reset,
});
