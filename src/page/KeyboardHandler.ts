import Sketch from '../sketch';
import { PageState } from './PageState';

export default function KeyboardHandler(
  sketch: Sketch,
  state: PageState,
  regenerate: () => void,
  download: (filename: string) => void,
) {
  return function handler(event: KeyboardEvent) {
    // TODO: end function if keydown is in an input element
    console.log(`Page Handling Key: ${event.code}`);
    switch (event.code) {
      case 'Space':
        // Space Bar - Randomize settings and draw a new image
        regenerate();
        break;
      case 'KeyS':
        download('x');
        break;
      default:
        // Do a lot of nothing.
        break;
    }
  };
}
