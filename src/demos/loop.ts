import { Constants, Gradient, Utils, Vec2 } from '@code-not-art/core';
import {
  ParameterModel,
  SketchDraw,
  SketchInit,
  SketchLoop,
} from 'sketch/Sketch.js';
import { Config, FrameData, Params, Sketch } from '../sketch/index.js';
const TAU = Constants.TAU;

type SketchData = {
  angle: number;
  absoluteAngle: number;
  gradient: Gradient;
};

const config = Config({
  enableLoopControls: true,
  menuDelay: 0,
});

// Warning: Display Names must all be unique
// TODO: Remove warning once we replace the control panel library
const params = {
  speed: Params.range('Speed', 2, [0, 10]),
  rotationSpeed: Params.range('Rotation Speed', 1, [0, 10]),
  dotSize: Params.range('Dot Size', 0.04, [0.005, 0.2, 0.001]),
  dotCount: Params.range('Dot Count', 24, [1, 89, 1]),
  twists: Params.range('Twists', 5, [1, 8, 1]),
} satisfies ParameterModel;

const init: SketchInit<typeof params, SketchData> = ({ palette }) => {
  const data: SketchData = {
    angle: 0,
    absoluteAngle: 0,
    gradient: new Gradient(palette.colors[1], palette.colors[2]).loop(),
  };

  return data;
};

const draw: SketchDraw<typeof params, SketchData> = ({ canvas }, _data) => {
  // One time setup instructions that we don't need to repeat every frame:
  canvas.transform.translate(canvas.get.size().scale(0.5));
};

const loop: SketchLoop<typeof params, SketchData> = (
  { canvas, palette, params },
  data,
  { frameTime }: FrameData,
) => {
  const speed = params.speed.value;
  const rotationSpeed = params.rotationSpeed.value;
  const dotSize = params.dotSize.value;
  const dotCount = params.dotCount.value;
  const twists = params.twists.value;

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
      center: circleOrigin,
      radius: canvas.get.minDim() * dotSize,
      fill: gradient.at(i / (dotCount > 1 ? dotCount - 1 : 1)),
    });
  });
  return false;
};

// const reset = ({}: SketchProps) => {};

const Art = Sketch<typeof params, SketchData>({
  config,
  params,
  draw,
  init,
  loop,
  // reset,
});

export default Art;
