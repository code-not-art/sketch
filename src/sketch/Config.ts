export type ConfigInput = {
  width?: number;
  height?: number;
  seed?: string;

  menuDelay?: number;
  enableImageControls?: boolean;
  enableLoopControls?: boolean;

  paletteType?: PaletteType;
};

export enum PaletteType {
  Random,
  Curated,
}

const Config = ({
  width = 1080,
  height = 1080,
  seed,
  menuDelay,
  enableImageControls = true,
  enableLoopControls = false,
  paletteType = PaletteType.Random,
}: ConfigInput) => {
  return {
    width: width,
    height: height,
    seed: seed || new Date().toISOString(),

    // controls
    menuDelay: menuDelay,
    enableImageControls: enableImageControls,
    enableLoopControls: enableLoopControls,

    // palettes
    paletteType: paletteType,
  };
};

export default Config;
