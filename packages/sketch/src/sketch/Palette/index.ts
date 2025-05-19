import { Color, Random, Utils } from '@code-not-art/core';
import niceColors from 'nice-color-palettes/1000';
import { PaletteType } from '../../sketch/Config.js';
import phrase from '../../utils/phrase.js';

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
	colors: [Color, Color, Color, Color, Color];
	constructor({ rng, type = PaletteType.Random }: PaletteParams = {}) {
		this.rng = rng || new Random('random palette');

		switch (type) {
			case PaletteType.Curated:
				// Get a set of 5 colours from nice-color-palettes
				const selection = this.rng.chooseOne(niceColors);
				this.colors = [
					new Color(selection[0]),
					new Color(selection[1]),
					new Color(selection[2]),
					new Color(selection[3]),
					new Color(selection[4]),
				];
				break;
			case PaletteType.Random:
				// Stick 5 random colours in our pallete
				this.colors = [this.rng.color(), this.rng.color(), this.rng.color(), this.rng.color(), this.rng.color()];
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
