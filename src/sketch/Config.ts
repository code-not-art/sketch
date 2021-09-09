export type ConfigInput = {
  width?: number;
  height?: number;
  seed?: string;
  menuDelay?: number;
};

export default class Config {
  width: number;
  height: number;
  seed: string;
  menuDelay?: number;

  constructor(input: ConfigInput) {
    this.width = input.width || 1080;
    this.height = input.height || 1080;
    this.seed = input.seed || new Date().toISOString();
    this.menuDelay = input.menuDelay;
  }
}
