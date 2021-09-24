export type ConfigInput = {
  width?: number;
  height?: number;
  seed?: string;
  menuDelay?: number;
};

const Config = (
  input: ConfigInput,
): {
  width: number;
  height: number;
  seed: string;
  menuDelay?: number;
} => {
  return {
    width: input.width || 1080,
    height: input.height || 1080,
    seed: input.seed || new Date().toISOString(),
    menuDelay: input.menuDelay,
  };
};

export default Config;
