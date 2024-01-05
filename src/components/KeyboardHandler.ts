import ImageState from './state/ImageState.js';
import LoopState from './state/LoopState.js';
import { shareViaUrl } from './share.js';

const keyActionDescriptions: Record<string, string> = {
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

  KeyU: 'Copy Shareable URL to Clipboard',
};

export default function KeyboardHandler(inputs: {
  state: ImageState;
  loopState: LoopState;
  params: Record<string, any>;
  redraw: () => void;
  download: () => void;
  toggleMenu: () => void;
}) {
  return function handler(event: KeyboardEvent) {
    const { state, loopState, params, redraw, download, toggleMenu } = inputs;

    // This line gets complaints from the TypeScript linter, but runs in the browser without fail.
    if (event.target && (<HTMLElement>event.target).localName === 'input') {
      return;
    }

    if (event.ctrlKey) {
      // Don't conflict with user Ctrl+Key commands
      return;
    }

    const eventDescriptionLog = keyActionDescriptions[event.code]
      ? `${event.code} - ${keyActionDescriptions[event.code]}`
      : undefined;
    if (eventDescriptionLog) {
      console.log(`Handling Key Press: ${eventDescriptionLog}`);
    }
    switch (event.code) {
      // ===== Save
      case 'KeyS':
        // S - Save current image
        download();
        break;

      // ===== Share
      case 'KeyU':
        shareViaUrl(state, params);
        break;

      // ===== Randomize
      case 'Space':
        // Space Bar - Randomize settings and redraw a new image
        state.random();
        redraw();
        break;
      case 'KeyI':
        // I - random image seed
        state.randomImage();
        redraw();
        break;
      case 'KeyC':
        // C - random color seed
        state.randomColor();
        redraw();
        break;

      // ===== Arrow keys to navigate through image and color seeds
      case 'ArrowRight':
        state.nextImage();
        redraw();
        break;
      case 'ArrowLeft':
        state.prevImage();
        redraw();
        break;
      case 'ArrowUp':
        state.nextColor();
        redraw();
        break;
      case 'ArrowDown':
        state.prevColor();
        redraw();
        break;

      // ===== Animation Controls
      case 'Enter':
      case 'NumpadEnter':
        loopState.togglePause();
        break;

      case 'KeyR':
        redraw();
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
