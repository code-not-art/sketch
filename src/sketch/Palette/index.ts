import { Random, Color, Utils } from '@code-not-art/core';
import { PaletteType } from '../../sketch/Config';

import phrase from '../../utils/phrase';
import niceColors from 'nice-color-palettes/1000';

/**
 * Pallete
 *  Provide a randomly selected set of 5 colors that can be used through an sketch, as well as method to generate new colours to the list.
 *  This allows a consistent set of colours thorughout one image and no selection criteria on the user.
 */
const { repeat } = Utils;

type PaletteParams = {
  rng?: Random;
  type?: PaletteType;
};
class Palette {
  rng: Random;
  colors: Color[];
  constructor({ rng, type = PaletteType.Random }: PaletteParams = {}) {
    this.rng = rng || new Random('random palette');

    this.colors = [];
    switch (type) {
      case PaletteType.Curated:
        // Get a set of 5 colours from nice-color-palettes
        const selection = rng?.chooseOne(niceColors);
        selection?.forEach((color) => this.colors.push(new Color(color)));
        break;
      case PaletteType.Random:
        // Stick 5 random colours in our pallete
        repeat(5, () =>
          this.colors.push(new Color({ seed: phrase(this.rng) })),
        );
    }
  }

  /**
   * Get another color from this palette's rng
   *  */
  another() {
    return new Color({ rng: this.rng });
  }

  // TODO: System for generating random colours with restrictions, ex. specific hue or range of hue and saturation.
}

export default Palette;
