import { Random } from '@code-not-art/core';
import { PaletteType } from '../../sketch/Config.js';
import { Palette } from '../../sketch/index.js';
import phrase from '../../utils/phrase.js';

export type ImageStateParams = {
	seed?: string;
	imageSeed?: string;
	colorSeed?: string;
	paletteType?: PaletteType;
	/** Seed to show initially, instead of a randomly generated image seed. */
	currentImageSeed?: string;
	/** Seed to show initially, instead of a randomly generated color seed. */
	currentColorSeed?: string;
	/** When `true`, the image seed is locked from the start. */
	imageLocked?: boolean;
	/** When `true`, the color seed is locked from the start. */
	colorLocked?: boolean;
};
export default class ImageState {
	_rng: Random;
	_imageSeedGenerator: Random;
	_colorSeedGenerator: Random;
	_seed: string;
	_paletteType: PaletteType;

	imageSeeds: string[];
	colorSeeds: string[];
	activeImage: number;
	activeColor: number;
	palette: Palette;

	_renderStart?: number;
	_renderStop?: number;
	renderCount: number;

	/** A locked image seed does not change when randomized or navigated. */
	imageLocked: boolean;
	/** A locked color seed does not change when randomized or navigated. */
	colorLocked: boolean;

	constructor({
		seed,
		imageSeed,
		colorSeed: paletteSeed,
		paletteType = PaletteType.Random,
		currentImageSeed,
		currentColorSeed,
		imageLocked = false,
		colorLocked = false,
	}: ImageStateParams = {}) {
		// definte the state from the seed or from the current Date/time
		this._seed = seed || new Date().toISOString();
		this._paletteType = paletteType;
		this._rng = new Random('sketch root', this._seed);

		// Initialize rngenerators for the image seeds and the color seeds
		this._imageSeedGenerator = new Random('image seed generator', imageSeed || this._rng.next().toString());
		this._colorSeedGenerator = new Random('color seed generator', paletteSeed || this._rng.next().toString());

		// Get the first seeds
		this.imageSeeds = [];
		this.colorSeeds = [];
		this.imageLocked = false;
		this.colorLocked = false;
		this.activeImage = 0;
		this.activeColor = 0;
		this.palette = new Palette({ type: this._paletteType });
		if (currentImageSeed) {
			this.imageSeeds.push(currentImageSeed);
		} else {
			this.randomImage();
		}
		if (currentColorSeed) {
			this.colorSeeds.push(currentColorSeed);
			this.regenPalette();
		} else {
			this.randomColor();
		}
		// Locks are applied last so that the initial seeds can be generated
		this.imageLocked = imageLocked;
		this.colorLocked = colorLocked;

		this.renderCount = 0;
	}

	startRender() {
		this._renderStart = Date.now();
		this._renderStop = undefined;
	}

	stopRender() {
		this._renderStop = Date.now();
		this.renderCount += 1;
	}

	getRenderTime(): number | undefined {
		if (this._renderStart && this._renderStop) {
			return this._renderStop - this._renderStart;
		} else {
			return;
		}
		// time here is pretty arbitrary, 33 is about 30fps which is a decent check rate i guess
	}

	setActiveColor(index: number) {
		if (this.colorLocked) {
			return;
		}
		this.activeColor = index;
		if (this.activeColor >= this.colorSeeds.length) {
			// random color runs setActiveColor, so dont need to do the palette creation and assignment
			this.randomColor();
		} else {
			// Don't need to generate new color, so lets get the active color fixed correctly and then set the new palette
			if (this.activeColor < 0) {
				this.activeColor = 0;
			}
			this.regenPalette();
		}
	}

	randomImage() {
		if (this.imageLocked) {
			return;
		}
		const imageSeed = phrase(this._imageSeedGenerator);
		this.imageSeeds.push(imageSeed);
		this.activeImage = this.imageSeeds.length - 1;
	}
	randomColor() {
		if (this.colorLocked) {
			return;
		}
		const colorSeed = phrase(this._colorSeedGenerator);
		this.colorSeeds.push(colorSeed);
		this.setActiveColor(this.colorSeeds.length - 1);
	}

	random() {
		this.randomImage();
		this.randomColor();
	}

	nextImage() {
		if (this.imageLocked) {
			return;
		}
		this.activeImage += 1;
		if (this.activeImage === this.imageSeeds.length) {
			this.randomImage();
		}
	}
	prevImage() {
		if (this.imageLocked) {
			return;
		}
		this.activeImage -= 1;
		if (this.activeImage < 0) {
			this.activeImage = 0;
		}
	}
	nextColor() {
		this.setActiveColor(this.activeColor + 1);
	}
	prevColor() {
		this.setActiveColor(this.activeColor - 1);
	}

	/**
	 * Sets a specific image seed and locks it. Does nothing if `seed` is empty.
	 */
	setImage(seed: string): void {
		if (!seed) {
			return;
		}
		if (seed !== this.getImage()) {
			this.imageSeeds.push(seed);
			this.activeImage = this.imageSeeds.length - 1;
		}
		this.imageLocked = true;
	}
	/**
	 * Sets a specific color seed and locks it. Does nothing if `seed` is empty.
	 */
	setColor(seed: string): void {
		if (!seed) {
			return;
		}
		if (seed !== this.getColor()) {
			this.colorSeeds.push(seed);
			this.activeColor = this.colorSeeds.length - 1;
			this.regenPalette();
		}
		this.colorLocked = true;
	}
	setImageLocked(locked: boolean): void {
		this.imageLocked = locked;
	}
	setColorLocked(locked: boolean): void {
		this.colorLocked = locked;
	}
	setPaletteType(type: PaletteType): void {
		this._paletteType = type;
		this.regenPalette();
	}

	getImage(): string {
		return this.imageSeeds[this.activeImage];
	}
	getColor(): string {
		return this.colorSeeds[this.activeColor];
	}
	getPalette(): Palette {
		return this.palette;
	}

	getRng(): Random {
		return this._rng;
	}

	restartRng(): void {
		this.regenPalette();
		this.regenRng();
	}
	private regenPalette(): void {
		this.palette = new Palette({
			rng: new Random('color rng', this.getColor()),
			type: this._paletteType,
		});
	}
	private regenRng(): void {
		this._rng = new Random('image rng', this.getImage());
	}
}
