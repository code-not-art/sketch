export type SketchConfigInput = {
  width?: number;
  height?: number;
  seed?: string;

  menuDelay?: number;
  enableImageControls?: boolean;
  enableLoopControls?: boolean;

  paletteType?: PaletteType;
};

export const PaletteType = {
  Random: 'RANDOM',
  Curated: 'CURATED',
} as const;

export type PaletteType = typeof PaletteType extends infer T
  ? T[keyof T]
  : never;

export const SketchConfig = ({
  width = 1080,
  height = 1080,
  seed,
  menuDelay,
  enableImageControls = true,
  enableLoopControls = false,
  paletteType = PaletteType.Random,
}: SketchConfigInput) => {
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
