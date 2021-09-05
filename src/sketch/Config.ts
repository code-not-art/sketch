export type ConfigInput = {
  width?: number;
  height?: number;
  seed?: string;
};

export default class Config {
  width: number;
  height: number;
  seed: string;

  constructor(input: ConfigInput) {
    this.width = input.width || 1080;
    this.height = input.height || 1080;
    this.seed = input.seed || new Date().toISOString();
  }
}
