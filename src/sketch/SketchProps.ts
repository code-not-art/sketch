import { Canvas, Random } from '@code-not-art/core';
import Palette from './Palette/index.js';
import { ParameterModel } from './Sketch.js';

export type SketchProps<Params extends ParameterModel> = {
  canvas: Canvas;
  palette: Palette;
  rng: Random;
  params: Params;
};
