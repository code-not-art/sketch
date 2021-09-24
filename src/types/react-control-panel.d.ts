declare module 'react-control-panel' {
  interface ElementProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }

  interface ControlProps extends ElementProps {
    label: string;
  }
  export const Checkbox = (props: ControlProps) => React.ReactElement;
  export const Text = (props: ControlProps) => React.ReactElement;

  interface RangeProps extends ControlProps {
    min: number;
    max: number;
    step: number;
  }
  export const Range = (props: RangeProps) => React.ReactElement;
  export const Interval = (props: RangeProps) => React.ReactElement;

  interface ColorProps extends ControlProps {
    format: 'rgb' | 'hex';
  }
  export const Color = (props: ColorProps) => React.ReactElement;

  interface ButtonProps extends ControlProps {
    action: () => void;
  }
  export const Button = (props: ButtonProps) => React.ReactElement;

  interface MultiboxProps extends ControlProps {
    colors: string[];
    names: string[];
  }
  export const Multibox = (props: MultiboxProps) => React.ReactElement;

  // This needs serious testing, I am unclear if the control props will get used at all.
  interface CustomProps extends ControlProps {
    Comp: (props: {
      value: any;
      onChange: function;
      theme: string;
    }) => React.ReactNode;
  }
  export const Custom = (props: CustomProps) => React.ReactElement;

  interface ControlPanelProps extends ElementProps {
    theme?: 'light' | 'dark';
    title?: string;
    initialState: any;
    onChange?: function;
    width: number;
  }
  export default ControlPanel = (props: ControlPanelProps) =>
    React.ReactElement;
}
