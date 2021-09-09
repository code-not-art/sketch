import Sketch, { Params } from './sketch';
import { ConfigInput } from './sketch/Config';
import SketchProps from './sketch/SketchProps';
// import FrameData from './sketch/FrameData';
import { Vec2, Utils } from '@code-not-art/core';
const { repeat } = Utils;

const config: ConfigInput = {
  // width: 2160,
  // height: 2160,
  // seed: 'predictable randomness',
  menuDelay: 10,
};
const params: Params = [
  { key: 'canvasFill', value: 0.76, min: 0.5, max: 1.1 },
  { key: 'gridWidth', value: 10, min: 1, max: 55, step: 1 },
  { key: 'circleFill', value: 0.72, min: 0.1, max: 2 },
  { key: '', label: 'Mask Layer' },
  { key: 'chanceHidden', value: 0.15, min: 0, max: 1 },
  { key: 'darkenRange', value: 5, min: 0, max: 20 },
  { key: 'lightenRange', value: 0, min: 0, max: 20 },
  { key: 'positionExponent', value: 1, min: 0, max: 5 },
];

const draw = ({ canvas, rng, palette, params }: SketchProps) => {
  const canvasFill = params.canvasFill as number;
  const gridWidth = params.gridWidth as number;
  const circleFill = params.circleFill as number;
  const chanceHidden = params.chanceHidden as number;
  const darkenRange = params.darkenRange as number;
  const lightenRange = params.lightenRange as number;
  const positionExponent = params.positionExponent as number;

  const width = canvas.get.width() * canvasFill;
  const height = canvas.get.height() * canvasFill;

  const minDim = Math.min(width, height);

  // Background
  canvas.fill(palette.colors[0]);

  // How to center:
  canvas.translate(new Vec2(canvas.get.width() / 2, canvas.get.height() / 2));
  // canvas.rotate(rng.angle());

  // const edgeGap = new Vec2(
  //   (width / 2) * (1 / canvasFill - 1),
  //   (height / 2) * (1 / canvasFill - 1),
  // );
  // canvas.translate(edgeGap);

  // canvas.draw.rect({
  //   point: new Vec2(-width / 2, -height / 2),
  //   height,
  //   width,
  //   fill: palette.colors[1],
  // });

  const circleRadius = minDim / gridWidth / 2;

  // Base layer dots
  repeat(gridWidth, (x) => {
    repeat(gridWidth, (y) => {
      const origin = new Vec2(x, y)
        .add(0.5 - gridWidth / 2)

        .scale(circleRadius * 2);
      // .add(new Vec2(-circleRadius, -circleRadius));
      canvas.draw.circle({
        origin: origin,
        radius: circleRadius * circleFill,
        fill: palette.colors[1],
      });
    });
  });

  // Overlaps
  repeat(gridWidth, (x) => {
    repeat(gridWidth, (y) => {
      // diagonal scheme
      // const offsetPostitionScale = Math.pow(
      //   Math.abs(x - y) / gridWidth,
      //   positionExponent,
      // );

      // inverse diagonal
      // const offsetPostitionScale = Math.pow(
      //  1 - Math.abs(x - y) / gridWidth,
      //   positionExponent,
      // );

      // Square Radial distance
      const distanceFromCenter = Math.sqrt(
        Math.pow(1 - Math.abs(gridWidth - 2 * x) / gridWidth, 2) +
          Math.pow(1 - Math.abs(gridWidth - 2 * y) / gridWidth, 2),
      );
      const offsetPostitionScale = Math.pow(
        distanceFromCenter,
        positionExponent,
      );

      const offset = Vec2.unit()
        .rotate(rng.angle())
        .scale(rng.int(0, circleRadius * circleFill))
        .scale(offsetPostitionScale);

      const origin = new Vec2(x, y)
        .add(0.5 - gridWidth / 2)
        .scale(circleRadius * 2)
        .add(!rng.bool(chanceHidden) ? offset : 0);
      canvas.draw.circle({
        origin: origin,
        radius: circleRadius * circleFill + 1,
        fill: palette.colors[0]
          .color()
          .darken(rng.fuzzy(darkenRange).float(darkenRange))
          .lighten(rng.fuzzy(lightenRange).float(lightenRange)),
      });
    });
  });
};

// const init = ({}: SketchProps) => {};

// const loop = ({}: SketchProps, {}: FrameData) => {};

// const reset = ({}: SketchProps) => {};

const Art: Sketch = new Sketch({
  config,
  params,
  draw,
  // init,
  // loop,
  // reset,
  id: 2,
});

export default Art;
