export interface Parameter {
  key: string;
  value: any;
  min?: number;
  max?: number;
  step?: number;
}

type Params = Parameter[];

export default Params;
