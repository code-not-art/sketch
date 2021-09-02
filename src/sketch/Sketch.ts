import Params from './Params';
import Config from './Config';
// import { Canvas, Random } from 'core';

type SketchProps = {
  // canvas: Canvas; // TODO need to import from linked core lib.
  // rng: Random;
};

interface Sketch {
  reset: () => void;
  init: (props: SketchProps) => void;
  draw: (props: SketchProps) => void;
  loop: (props: SketchProps, time: number) => void;
  params: Params;
  config: Config;
}

export default Sketch;
