import { Canvas, Random } from '@code-not-art/core';
import Palette from './Palette';
import { ParameterModel } from './Sketch';

type SketchProps<PM extends ParameterModel, DataModel> = {
  canvas: Canvas;
  palette: Palette;
  rng: Random;
  params: PM;
  data: DataModel;
};

export default SketchProps;
