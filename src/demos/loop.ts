import Sketch from '../sketch';
import SketchProps from '../sketch/SketchProps';
import FrameData from '../sketch/FrameData';
import { Vec2 } from '@code-not-art/core';

// const config: ConfigInput = {};
// const params: Params = [];

const draw = ({}: SketchProps) => {
  // Nothing doing, checkout the loop!
};

const init = ({ canvas, data }: SketchProps) => {
  console.log('init');
  data.point = Vec2.origin();
  data.direction = Vec2.ones();
  data.speed = canvas.get.minDim() / 100;
};

const loop = (
  { canvas, palette, rng, data }: SketchProps,
  { frame, frameTime }: FrameData,
) => {
  canvas.fill(palette.colors[0]);
  // console.log(`frame`, frame, frameTime, rng.next());
  data.point = data.point.add(data.direction.scale(data.speed));
  if (!data.point.within(canvas.get.size())) {
    data.direction = data.direction.scale(-1);
  }
  canvas.draw.circle({
    origin: data.point,
    radius: canvas.get.minDim() / 4,
    fill: palette.colors[1],
  });
  return false;
};

// const reset = ({}: SketchProps) => {};

const Art: Sketch = new Sketch({
  // config,
  // params,
  draw,
  init,
  loop,
  // reset,
});

export default Art;
