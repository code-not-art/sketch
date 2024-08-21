import { InputText } from 'primereact/inputtext';
import { useState, type ChangeEventHandler } from 'react';
import { styled } from 'styled-components';
import type { ControlPanelParameterString } from '../../../control-panel/types/parameters.js';

const StyledInput = styled(InputText)`
  height: 1.6rem;
  font-family: monospace;
  background: black;
  //   padding: 0.2rem 0.4rem;
  // 	coloir
`;

export const ControlPanelString = (props: {
  parameter: ControlPanelParameterString;
  value: string;
  onChange: (newValue: string) => void;
}) => {
  const { parameter, onChange } = props;

  const [val, setVal] = useState(props.value);
  const changeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    setVal(event.target.value);
    onChange(newValue);
  };
  return (
    <div className="card flex justify-content-center mb-2">
      <div className="w-full">
        <label>{parameter.label}</label>
        <StyledInput
          // className="mt-1 w-full text-xs p-2"
          value={val}
          onChange={(e) => e && changeHandler(e)}
        />
      </div>
    </div>
  );
};
