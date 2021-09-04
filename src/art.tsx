import Sketch, { Config, Params } from './sketch';
import { SketchProps } from './sketch/Sketch';
import { Color, Vec2 } from '@code-not-art/core';

const config = Config({});
const params = Params();

const init = ({}: SketchProps) => {};

const draw = ({ canvas }: SketchProps) => {
  const width = canvas.get.width();
  const height = canvas.get.height();

  canvas.draw.circle({
    origin: new Vec2(width, height).scale(0.5),
    radius: Math.min(canvas.get.minDim() / 3),
    fill: new Color(),
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
