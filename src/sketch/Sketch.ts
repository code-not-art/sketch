import { Params } from './Params';
import { Config } from './Config';
import { Canvas, Random } from '@code-not-art/core';

export type SketchProps = {
  canvas: Canvas;
  rng: Random;
  colorRng: Random;
};

interface Sketch {
  reset: (props: SketchProps) => void;
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, time: number) => void;
  params: Params;
  config: Config;
}

export default Sketch;
