import { ParameterModel } from 'sketch/Sketch';
import { Config, FrameData, Sketch, SketchProps, Params } from '../sketch';
import { Constants, Gradient, Vec2, Utils } from '@code-not-art/core';
const TAU = Constants.TAU;

const config = Config({
  enableLoopControls: true,
  menuDelay: 0,
});

const params = {
  speed: Params.range('speed', 2, [0, 10]),
  rotationSpeed: Params.range('rotationSpeed', 1, [0, 10]),
  dotSize: Params.range('dotSize', 0.04, [0.005, 0.2, 0.001]),
  dotCount: Params.range('dotCount', 24, [1, 89, 1]),
  twists: Params.range('twists', 5, [1, 8, 1]),
} satisfies ParameterModel;

type Data = {
  gradient?: Gradient;
  angle: number;
  absoluteAngle: number;
};
const initialData: Data = {
  angle: 0,
  absoluteAngle: 0,
};

type Props = SketchProps<typeof params, Data>;

const draw = ({ canvas, palette, data }: Props) => {
  // One time setup instructions that we don't need to repeat every frame:
  canvas.transform.translate(canvas.get.size().scale(0.5));

  // define the gradient in the draw step so that when the color is updated the gradient is regenerated.
  // if this is done in the init, the gradient won't be updated until the whole image is refreshed.
  // if this is done in the loop, it will be regenerated every frame which is unnecessary work
  data.gradient = new Gradient(palette.colors[1], palette.colors[2]).loop();
};

const init = ({ data }: Props) => {
  data.angle = 0;
  data.absoluteAngle = 0;
};

const loop = (
  { canvas, palette, params, data }: Props,
  { frameTime }: FrameData,
) => {
  const speed = params.speed.value;
  const rotationSpeed = params.rotationSpeed.value;
  const dotSize = params.dotSize.value;
  const dotCount = params.dotCount.value;
  const twists = params.twists.value;

  const gradient = data.gradient;

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
      fill: gradient?.at(i / (dotCount > 1 ? dotCount - 1 : 1)),
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
  initialData,
});

export default Art;
