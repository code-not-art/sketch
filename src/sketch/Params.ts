export interface Parameter {
  key: string;
  label?: string;
  value?: any;
  min?: number;
  max?: number;
  step?: number;
}

type Params = Parameter[];

export default Params;
