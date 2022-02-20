import { Random, Color, Utils } from '@code-not-art/core';

import phrase from '../../utils/phrase';

/**
 * Pallete
 *  Provide a randomly selected set of 5 colors that can be used through an sketch, as well as method to generate new colours to the list.
 *  This allows a consistent set of colours thorughout one image and no selection criteria on the user.
 */
const repeat = Utils.repeat;

class Palette {
  rng: Random;
  colors: Color[];
  constructor(rng?: Random) {
    this.rng = rng || new Random('random palette');

    this.colors = [];
    // Stick 5 random colours in our pallete
    repeat(5, () => this.colors.push(new Color({ seed: phrase(this.rng) })));
  }

  next() {
    this.colors.push(new Color({ rng: this.rng }));
  }

  // TODO: System for generating random colours with restrictions, ex. specific hue or range of hue and saturation.
}

export default Palette;
