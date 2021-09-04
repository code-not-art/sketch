export type Config = {
  width: number;
  height: number;
  name: string;
};

export default (values: Partial<Config>): Config => {
  return {
    width: values.width || 1080,
    height: values.height || 1080,
    name: values.name || new Date().toISOString(),
  };
};
