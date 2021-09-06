import { Random } from '@code-not-art/core';
import phrase from '../../utils/phrase';

export default class PageState {
  _rng: Random;
  _imageSeedGenerator: Random;
  _colorSeedGenerator: Random;
  _seed: string;

  imageSeeds: string[];
  colorSeeds: string[];
  activeImage: number;
  activeColor: number;

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
    this.random();
  }

  randomImage() {
    const imageSeed = phrase(this._imageSeedGenerator);
    this.imageSeeds.push(imageSeed);
    this.activeImage = this.imageSeeds.length - 1;
  }
  randomColor() {
    const colorSeed = phrase(this._colorSeedGenerator);
    this.colorSeeds.push(colorSeed);
    this.activeColor = this.colorSeeds.length - 1;
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
    this.activeColor += 1;
    if (this.activeColor === this.colorSeeds.length) {
      this.randomColor();
    }
  }
  prevColor() {
    this.activeColor -= 1;
    if (this.activeColor < 0) {
      this.activeColor = 0;
    }
  }

  getImage(): string {
    return this.imageSeeds[this.activeImage];
  }
  getColor(): string {
    return this.colorSeeds[this.activeColor];
  }

  getImageRng(): Random {
    return new Random('image rng', this.getImage());
  }
  getColorRng(): Random {
    return new Random('color rng', this.getColor());
  }
}
