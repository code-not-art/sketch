import { useState } from 'react';
import type { ControlPanelParameterNumber } from '../../../control-panel/types/parameters.js';
import { styled } from 'styled-components';
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';

const StyledInput = styled(InputNumber)`
  height: 1.6rem;

  input {
    font-family: monospace;
    font-size: 0.75rem;
    background: black;
    padding: 0.2rem 0.4rem;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export const ControlPanelNumber = (props: {
  parameter: ControlPanelParameterNumber;
  value: number;
  onChange: (value: number) => void;
}) => {
  const { parameter, value, onChange } = props;

  const [internalValue, setInternalValue] = useState(value);

  const changeHandler = (eventValue: number) => {
    setInternalValue(eventValue);
    onChange(eventValue);
  };
  return (
    <>
      <div className="card flex justify-content-center mb-2">
        <div className="w-full">
          <label>{parameter.label}</label>
          <StyledInput
            className=" w-full mt-1"
            value={internalValue}
            onChange={(e) => e.value !== null && changeHandler(e.value)}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step * 5}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              padding: 0,
            }}
          />
          <Slider
            className="w-full"
            value={internalValue}
            onChange={(e) =>
              typeof e.value === 'number' && changeHandler(e.value)
            }
            min={parameter.min}
            max={parameter.max}
            step={parameter.step}
            style={{ borderRadius: 0 }}
          />
        </div>
      </div>
    </>
  );
};
