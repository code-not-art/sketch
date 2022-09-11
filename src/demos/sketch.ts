import { Vec2, Utils } from '@code-not-art/core';
import { PaletteType } from '../sketch/Config';
import { Config, Sketch, SketchProps, Params, Parameter } from '../sketch';
const { repeat } = Utils;

const config = Config({
  menuDelay: 0,
  paletteType: PaletteType.Random,
});
const params: Parameter[] = [
  Params.header('Size and Scale'),
  Params.range('canvasFill', 0.76, [0.5, 1.1]),
  Params.range('gridWidth', 10, [1, 55, 1]),
  Params.range('circleFill', 0.72, [0.1, 2]),

  Params.header('Mask Layer'),
  Params.range('chanceHidden', 0.72),
  Params.range('chanceNoMask', 0.15),
  Params.range('darkenRange', 5, [0, 20]),
  Params.range('lightenRange', 0, [0, 20]),
  Params.range('positionExponent', 1, [0, 5]),
];

const draw = ({ canvas, rng, palette, params }: SketchProps) => {
  const canvasFill = params.canvasFill as number;
  const gridWidth = params.gridWidth as number;
  const circleFill = params.circleFill as number;
  const chanceHidden = params.chanceHidden as number;
  const chanceNoMask = params.chanceNoMask as number;
  const darkenRange = params.darkenRange as number;
  const lightenRange = params.lightenRange as number;
  const positionExponent = params.positionExponent as number;

  // Background
  canvas.fill(palette.colors[0]);

  // Put origin at center of canvas:
  canvas.transform.translate(
    new Vec2(canvas.get.width() / 2, canvas.get.height() / 2),
  );

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

  const circleRadius = (canvas.get.minDim() * canvasFill) / gridWidth / 2;

  // Base layer dots
  repeat(gridWidth, (x) => {
    repeat(gridWidth, (y) => {
      const origin = new Vec2(x, y)
        .add(0.5 - gridWidth / 2)

        .scale(circleRadius * 2);
      // .add(new Vec2(-circleRadius, -circleRadius));
      canvas.draw.circle({
        center: origin,
        radius: circleRadius * circleFill,
        fill: palette.colors[1],
      });
    });
  });

  // Overlaps
  repeat(gridWidth, (x) => {
    repeat(gridWidth, (y) => {
      // diagonal scheme
      const offsetPostitionScale = Math.pow(
        Math.abs(x - y) / gridWidth,
        positionExponent,
      );

      // inverse diagonal
      // const offsetPostitionScale = Math.pow(
      //  1 - Math.abs(x - y) / gridWidth,
      //   positionExponent,
      // );

      // Square Radial distance
      // const distanceFromCenter = Math.sqrt(
      //   Math.pow(1 - Math.abs(gridWidth - 2 * x) / gridWidth, 2) +
      //     Math.pow(1 - Math.abs(gridWidth - 2 * y) / gridWidth, 2),
      // );
      // const offsetPostitionScale = Math.pow(
      //   distanceFromCenter,
      //   positionExponent,
      // );

      const offset = Vec2.unit()
        .rotate(rng.angle())
        .scale(rng.int(0, circleRadius * circleFill))
        .scale(offsetPostitionScale);

      const origin = new Vec2(x, y)
        .add(0.5 - gridWidth / 2)
        .scale(circleRadius * 2)
        .add(rng.bool(chanceHidden) ? 0 : offset);

      rng.push('skippable draw');
      const hideMask = !rng.bool(chanceNoMask);
      hideMask &&
        canvas.draw.circle({
          center: origin,
          radius: circleRadius * circleFill + 1,
          fill: palette.colors[0]
            .color()
            .darken(rng.fuzzy(darkenRange).float(darkenRange))
            .lighten(rng.fuzzy(lightenRange).float(lightenRange)),
        });
      rng.pop();
    });
  });
};

// const init = ({}: SketchProps) => {};

// const loop = ({}: SketchProps, {}: FrameData): boolean => {};

// const reset = ({}: SketchProps) => {};

const Art = Sketch({
  config,
  params,
  draw,
  // init,
  // loop,
  // reset,
});

export default Art;
