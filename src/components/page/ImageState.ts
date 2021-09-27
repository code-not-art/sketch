import { Random } from '@code-not-art/core';
import { Palette } from '../../sketch';
import phrase from '../../utils/phrase';

export default class ImageState {
  _rng: Random;
  _imageSeedGenerator: Random;
  _colorSeedGenerator: Random;
  _seed: string;

  imageSeeds: string[];
  colorSeeds: string[];
  activeImage: number;
  activeColor: number;
  palette: Palette;

  _renderStart?: number;
  _renderStop?: number;
  renderCount: number;

  userImageSeed?: string;
  userColorSeed?: string;

  constructor(seed?: string) {
    // definte the state from the seed or from the current Date/time
    this._seed = seed || new Date().toISOString();
    this._rng = new Random('sketch root', this._seed);

    // Initialize rngenerators for the image seeds and the color seeds
    this._imageSeedGenerator = new Random(
      'image seed generator',
      this._rng.next().toString(),
    );
    this._colorSeedGenerator = new Random(
      'color seed generator',
      this._rng.next().toString(),
    );

    // Get the first seeds
    this.imageSeeds = [];
    this.colorSeeds = [];
    this.activeImage = 0;
    this.activeColor = 0;
    this.palette = new Palette();
    this.random();

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
    this.activeColor = index;
    if (this.activeColor >= this.colorSeeds.length) {
      // random color runs setActiveColor, so dont need to do the palette creation and assignment
      this.randomColor();
    } else {
      // Don't need to generate new color, so lets get the active color fixed correctly and then set the new palette
      if (this.activeColor < 0) {
        this.activeColor = 0;
      }
      this.palette = new Palette(this.getColorRng());
    }
  }

  randomImage() {
    const imageSeed = phrase(this._imageSeedGenerator);
    this.imageSeeds.push(imageSeed);
    this.activeImage = this.imageSeeds.length - 1;
  }
  randomColor() {
    const colorSeed = phrase(this._colorSeedGenerator);
    this.colorSeeds.push(colorSeed);
    this.setActiveColor(this.colorSeeds.length - 1);
  }

  random() {
    this.randomImage();
    this.randomColor();
  }

  nextImage() {
    this.activeImage += 1;
    if (this.activeImage === this.imageSeeds.length) {
      this.randomImage();
    }
  }
  prevImage() {
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

  setUserImage(seed: string): void {
    this.userImageSeed = seed;
  }
  setUserColor(seed: string): void {
    this.userColorSeed = seed;
    this.palette = new Palette(this.getColorRng());
  }

  getImage(): string {
    return this.userImageSeed
      ? this.userImageSeed
      : this.imageSeeds[this.activeImage];
  }
  getColor(): string {
    return this.userColorSeed
      ? this.userColorSeed
      : this.colorSeeds[this.activeColor];
  }
  getPalette(): Palette {
    return this.palette;
  }

  getImageRng(): Random {
    return new Random('image rng', this.getImage());
  }
  private getColorRng(): Random {
    return new Random('color rng', this.getColor());
  }
}
