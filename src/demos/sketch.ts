import { Vec2, Utils } from '@code-not-art/core';
import { PaletteType } from '../sketch/Config';
import { Config, Sketch, SketchProps, Params, FrameData } from '../sketch';
const { repeat } = Utils;

const config = Config({
  menuDelay: 0,
  paletteType: PaletteType.Random,
});

// Warning: Display Names must all be unique
// TODO: Remove warning once we replace the control panel library
const parameters = {
  sizeHeader: Params.header('Size and Scale'),
  canvasFill: Params.range('Image Fill', 0.76, [0.5, 1.1]),
  gridWidth: Params.range('Grid Size', 10, [1, 55, 1]),
  circleFill: Params.range('Circle Fill', 0.72, [0.1, 2]),

  maskLayerHeader: Params.header('Mask Layer'),
  chanceHidden: Params.range('Chance Hidden', 0.72),
  chanceNoMask: Params.range('Chance No Mask', 0.15),
  darkenRange: Params.range('Darken Masks', 5, [0, 20]),
  lightenRange: Params.range('Lighten Masks', 0, [0, 20]),
  positionExponent: Params.range('Circle Position Spread', 1, [0, 5]),
};

const initialData = {};

type Props = SketchProps<typeof parameters, typeof initialData>;

const draw = ({ canvas, rng, palette, params }: Props) => {
  const canvasFill = params.canvasFill.value;
  const gridWidth = params.gridWidth.value;
  const circleFill = params.circleFill.value;

  const chanceHidden = params.chanceHidden.value;
  const chanceNoMask = params.chanceNoMask.value;
  const darkenRange = params.darkenRange.value;
  const lightenRange = params.lightenRange.value;
  const positionExponent = params.positionExponent.value;

  // Background
  canvas.fill(palette.colors[0]);

  // Put origin at center of canvas:
  canvas.transform.translate(
    new Vec2(canvas.get.width() / 2, canvas.get.height() / 2),
  );

  const circleRadius = (canvas.get.minDim() * canvasFill) / gridWidth / 2;

  // Base layer dots
  repeat(gridWidth, (x) => {
    repeat(gridWidth, (y) => {
      const center = new Vec2(x, y)
        .add(0.5 - gridWidth / 2)
        .scale(circleRadius * 2);
      canvas.draw.circle({
        center,
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

      const offset = Vec2.unit()
        .rotate(rng.angle())
        .scale(rng.int(0, circleRadius * circleFill))
        .scale(offsetPostitionScale);

      const center = new Vec2(x, y)
        .add(0.5 - gridWidth / 2)
        .scale(circleRadius * 2)
        .add(rng.bool(chanceHidden) ? 0 : offset);

      rng.push('skippable draw');
      const hideMask = !rng.bool(chanceNoMask);
      hideMask &&
        canvas.draw.circle({
          center,
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

// const init = ({}: Props) => {};

// const loop = ({}: Props, {}: FrameData): boolean => {};

// const reset = ({}: Props) => {};

const Art = Sketch<typeof parameters, typeof initialData>({
  config,
  params: parameters,
  initialData,
  // reset,
  // init,
  draw,
  // loop,
});

export default Art;
