import {
  Config,
  FrameData,
  Sketch,
  SketchProps,
  Params,
  Parameter,
} from '../sketch';
import { Constants, Gradient, Vec2, Utils } from '@code-not-art/core';
const TAU = Constants.TAU;

const config = Config({
  loopControls: true,
  menuDelay: 0,
});

const params: Parameter[] = [
  Params.range('speed', 2, [0, 10]),
  Params.range('rotationSpeed', 1, [0, 10]),
  Params.range('dotSize', 0.04, [0.005, 0.2, 0.001]),
  Params.range('dotCount', 24, [1, 89, 1]),
  Params.range('twists', 5, [1, 8, 1]),
];

const draw = ({ canvas, palette, data }: SketchProps) => {
  // One time setup instructions that we don't need to repeat every frame:
  canvas.transform.translate(canvas.get.size().scale(0.5));

  // define the gradient in the draw step so that when the color is updated the gradient is regenerated.
  // if this is done in the init, the gradient won't be updated until the whole image is refreshed.
  // if this is done in the loop, it will be regenerated every frame which is unnecessary work
  data.gradient = new Gradient(palette.colors[1], palette.colors[2]).loop();
};

const init = ({ palette, data }: SketchProps) => {
  data.angle = 0;
  data.absoluteAngle = 0;
};

const loop = (
  { canvas, palette, rng, params, data }: SketchProps,
  { frameTime }: FrameData,
) => {
  const speed = params.speed as number;
  const rotationSpeed = params.rotationSpeed as number;
  const dotSize = params.dotSize as number;
  const dotCount = params.dotCount as number;
  const twists = params.twists as number;

  const gradient = data.gradient as Gradient;

  canvas.fill(palette.colors[0]);

  data.angle += ((frameTime / 10000) * TAU * speed) / twists;

  data.absoluteAngle += (frameTime / 10000) * TAU * rotationSpeed;

  Utils.repeat(dotCount, (i) => {
    const repeatFraction = i / dotCount;
    const angle = data.angle + TAU * repeatFraction;
    const spinRadius = canvas.get.minDim() * 0.25;
    const spinOffset = Vec2.unit()
      .scale(canvas.get.minDim() * 0.15)
      .rotate(TAU * repeatFraction);

    const circleOrigin = Vec2.unit()
      .rotate(angle * twists)
      .scale(spinRadius)
      .add(spinOffset)
      .rotate(data.absoluteAngle);

    canvas.draw.circle({
      origin: circleOrigin,
      radius: canvas.get.minDim() * dotSize,
      fill: gradient.at(i / (dotCount > 1 ? dotCount - 1 : 1)),
    });
  });
  return false;
};

// const reset = ({}: SketchProps) => {};

const Art = Sketch({
  config,
  params,
  draw,
  init,
  loop,
  // reset,
});

export default Art;
