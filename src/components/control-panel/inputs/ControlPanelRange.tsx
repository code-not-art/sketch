import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import { useState } from 'react';
import { styled } from 'styled-components';
import type {
  ControlPanelParameterRange,
  ControlPanelValueRange,
  Range,
} from '../../../control-panel/types/parameters.js';

const StyledInput = styled(InputNumber)`
  height: 1.6rem;
  width: 50%;

  input {
    margin: 0;
    font-family: monospace;
    font-size: 0.75rem;
    background: black;
    padding: 0.2rem 0.4rem;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .p-inputtext:enabled:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: 0 0 0 0rem rgba(251, 191, 36, 0.2);
    border-color: none;
  }
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
`;
export const ControlPanelRange = (props: {
  parameter: ControlPanelParameterRange;
  value: ControlPanelValueRange;
  onChange: (value: Range) => void;
}) => {
  const { parameter, value, onChange } = props;

  const [internalValue, setInternalValue] = useState(value);
  const setRange = (range: Range) => {
    setInternalValue(range);
    onChange([...range]);
  };

  const clampStart = (value: number) =>
    value > parameter.startMax ? parameter.startMax : value;
  const clampEnd = (value: number) =>
    value < parameter.endMin ? parameter.endMin : value;

  const clampValues = (values: Range): Range => {
    // return values;
    let [start, end] = values;
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    start = start > parameter.startMax ? parameter.startMax : start;
    end = end < parameter.endMin ? parameter.endMin : end;

    const changingStart = start !== internalValue[0];

    const diff = end - start;
    if (diff < parameter.diffMin) {
      if (changingStart) {
        if (start + parameter.diffMin > parameter.max) {
          start = parameter.max - parameter.diffMin;
          end = parameter.max;
        } else {
          end = start + parameter.diffMin;
        }
      } else {
        if (end - parameter.diffMin < parameter.min) {
          end = parameter.min + parameter.diffMin;
          start = parameter.min;
        } else {
          start = end - parameter.diffMin;
        }
      }
    }
    if (diff > parameter.diffMax) {
      if (changingStart) {
        end = start + parameter.diffMax;
      } else {
        start = end - parameter.diffMax;
      }
    }
    return [start, end];
  };
  const onStartChange = (start: number) => {
    setRange(clampValues([start, internalValue[1]]));
  };
  const onEndChange = (end: number) => {
    setRange(clampValues([internalValue[0], end]));
  };
  const onSliderChange = (array: Range) => {
    setRange(clampValues(array));
  };

  return (
    <>
      <div className="card flex align-items-center justify-content-center mb-2 ">
        <div className="w-full">
          <label>{parameter.label}</label>
          <br />
          <StyledInput
            value={internalValue[0]}
            onChange={(event) => event.value && onStartChange(event.value)}
          />
          <StyledInput
            value={internalValue[1]}
            onChange={(event) => event.value && onEndChange(event.value)}
          />
          <Slider
            range
            className="w-full"
            value={internalValue}
            onChange={(e) => {
              Array.isArray(e.value) && onSliderChange(e.value);
            }}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step}
            style={{ borderRadius: 0, height: '0.5rem' }}
          />
        </div>
      </div>
    </>
  );
};
