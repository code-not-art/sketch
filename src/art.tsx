import Sketch, { Params } from './sketch';
import { ConfigInput } from './sketch/Config';
import SketchProps from './sketch/SketchProps';
// import FrameData from './sketch/FrameData';
import { Vec2 } from '@code-not-art/core';

const config: ConfigInput = {
  // width: 2160,
  // height: 2160,
  // seed: 'predictable randomness',
};
const params: Params = [
  { key: 'canvasFill', value: 0.95, min: 0.5, max: 1 },
  { key: 'show', value: true },
];
const draw = ({ canvas, rng, palette, params }: SketchProps) => {
  const canvasFill = params.canvasFill as number;
  const show = params.show as boolean;

  const width = canvas.get.width() * canvasFill;
  const height = canvas.get.height() * canvasFill;

  // Background
  canvas.fill(palette.colors[0]);

  // How to center:
  canvas.translate(new Vec2(canvas.get.width() / 2, canvas.get.height() / 2));
  canvas.rotate(rng.angle());

  const edgeGap = new Vec2(
    (width / 2) * (1 / canvasFill - 1),
    (height / 2) * (1 / canvasFill - 1),
  );
  canvas.draw.rect({
    point: edgeGap,
    height,
    width,
    fill: palette.colors[1],
  });

  show &&
    canvas.draw.circle({
      origin: new Vec2(rng.int(0, width), rng.int(0, height)),
      radius: rng.float(0.2, 1) * Math.min(canvas.get.minDim() / 3),
      fill: palette.colors[2],
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
});

export default Art;
