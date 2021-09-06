import PageState from './PageState';

const keyActionDescriptions: { [key: string]: string } = {
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
  regenerate: () => void,
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
        regenerate();
        break;
      case 'KeyI':
        // I - random image seed
        state.randomImage();
        regenerate();
        break;
      case 'KeyC':
        // C - random color seed
        state.randomColor();
        regenerate();
        break;

      // ===== Arrow keys to navigate through image and color seeds
      case 'ArrowRight':
        state.nextImage();
        regenerate();
        break;
      case 'ArrowLeft':
        state.prevImage();
        regenerate();
        break;
      case 'ArrowUp':
        state.nextColor();
        regenerate();
        break;
      case 'ArrowDown':
        state.prevColor();
        regenerate();
        break;

      default:
        // Do a lot of nothing.
        break;
    }
  };
}
