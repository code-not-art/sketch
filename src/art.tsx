import Sketch, { Config, Params } from './sketch';
import { SketchProps } from './sketch/Sketch';
import { Color, Vec2 } from '@code-not-art/core';

const config = Config({
  // width: 2160,
  // height: 2160,
  // seed: 'predictable randomness',
});
const params = Params();

const init = ({}: SketchProps) => {};

const draw = ({ canvas, rng, colorRng }: SketchProps) => {
  const width = canvas.get.width();
  const height = canvas.get.height();

  // canvas.fill(new Color({ rng: colorRng }));

  canvas.draw.circle({
    origin: new Vec2(rng.int(0, width), rng.int(0, height)),
    radius: rng.float(0.2, 1) * Math.min(canvas.get.minDim() / 3),
    fill: new Color({ rng: colorRng }),
  });
};

const loop = ({}: SketchProps) => {};

const reset = ({ canvas }: SketchProps) => {
  canvas.clear();
};

const Art: Sketch = {
  config,
  params,
  init,
  draw,
  loop,
  reset,
};

export default Art;
