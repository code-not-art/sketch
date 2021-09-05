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
const params = Params();

const draw = ({ canvas, rng, palette }: SketchProps) => {
  const width = canvas.get.width();
  const height = canvas.get.height();

  canvas.fill(palette.colors[0]);

  canvas.draw.circle({
    origin: new Vec2(rng.int(0, width), rng.int(0, height)),
    radius: rng.float(0.2, 1) * Math.min(canvas.get.minDim() / 3),
    fill: palette.colors[1],
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
