import StringMap from 'types/StringMap';
import PageState from './PageState';

const keyActionDescriptions: StringMap<string> = {
  KeyS: 'Saving Image',

  Space: 'Randomizing all seeds',
  KeyI: 'Randomizing Image seed',
  KeyC: 'Randomizing Color seed',

  ArrowRight: 'Next Image seed',
  ArrowLeft: 'Previous Image seed',
  ArrowUp: 'Next Color seed',
  ArrowDown: 'Previous Color seed',
};

export default function KeyboardHandler(
  state: PageState,
  draw: () => void,
  download: () => void,
) {
  return function handler(event: KeyboardEvent) {
    // TODO: end function if keydown is in an input element
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

      default:
        // Do a lot of nothing.
        break;
    }
  };
}
