import StringMap from 'utils/StringMap';
import LoopState from './LoopState';
import ImageState from './ImageState';

const keyActionDescriptions: StringMap<string> = {
  KeyS: 'Saving Image',

  Space: 'Randomizing all seeds',
  KeyI: 'Randomizing Image seed',
  KeyC: 'Randomizing Color seed',

  ArrowRight: 'Next Image seed',
  ArrowLeft: 'Previous Image seed',
  ArrowUp: 'Next Color seed',
  ArrowDown: 'Previous Color seed',

  Enter: 'Pause Animation Loop',
  NumpadEnter: 'Pause Animation Loop',

  KeyR: 'Redraw Sketch and Restart Loop',

  KeyM: 'Toggle Menu Visibility',
};

export default function KeyboardHandler(
  state: ImageState,
  loopState: LoopState,
  draw: () => void,
  restart: () => void,
  download: () => void,
  toggleMenu: () => void,
) {
  return function handler(event: KeyboardEvent) {
    // This line gets complaints from the TypeScript linter, but runs in the browser without fail.
    if (event.target && (<HTMLElement>event.target).localName === 'input') {
      return;
    }

    if (event.ctrlKey) {
      // Don't conflict with user Ctrl+Key commands
      return;
    }

    const actionDescriptionLog = keyActionDescriptions[event.code]
      ? ` - ${keyActionDescriptions[event.code]}`
      : '';
    console.log(`[Page] Key: ${event.code}${actionDescriptionLog}`);
    switch (event.code) {
      // ===== Save
      case 'KeyS':
        // S - Save current image
        download();
        break;

      // ===== Randomize
      case 'Space':
        // Space Bar - Randomize settings and draw a new image
        state.random();
        draw();
        break;
      case 'KeyI':
        // I - random image seed
        state.randomImage();
        draw();
        break;
      case 'KeyC':
        // C - random color seed
        state.randomColor();
        draw();
        break;

      // ===== Arrow keys to navigate through image and color seeds
      case 'ArrowRight':
        state.nextImage();
        draw();
        break;
      case 'ArrowLeft':
        state.prevImage();
        draw();
        break;
      case 'ArrowUp':
        state.nextColor();
        draw();
        break;
      case 'ArrowDown':
        state.prevColor();
        draw();
        break;

      // ===== Animation Controls
      case 'Enter':
      case 'NumpadEnter':
        loopState.togglePause();
        break;

      case 'KeyR':
        restart();
        break;

      // ===== UI Controls
      case 'KeyM':
        toggleMenu();
        break;

      default:
        // Do a lot of nothing.
        break;
    }
  };
}
