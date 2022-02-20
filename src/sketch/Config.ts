export type ConfigInput = {
  width?: number;
  height?: number;
  seed?: string;
  menuDelay?: number;
  enableLoopControls?: boolean;
  enableImageControls?: boolean;
};

const Config = (input: ConfigInput) => {
  return {
    width: input.width || 1080,
    height: input.height || 1080,
    seed: input.seed || new Date().toISOString(),
    menuDelay: input.menuDelay,
    enableLoopControls: input.enableLoopControls || false,
    enableImageControls: input.enableImageControls || true,
  };
};

export default Config;
