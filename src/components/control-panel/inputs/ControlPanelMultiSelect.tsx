import { useState } from 'react';
import type { ControlPanelParameterMultiSelect } from '../../../control-panel/types/parameters.js';

import {
  ToggleButton,
  type ToggleButtonChangeEvent,
} from 'primereact/togglebutton';
import { Column } from 'primereact/column';
import { styled } from 'styled-components';

const StyledToggleButton = styled(ToggleButton)`
  .p-button {
    padding: 0.15rem 0.35rem;
  }
`;

export const ControlPanelMultiSelect = <TOptions extends string>(props: {
  parameter: ControlPanelParameterMultiSelect;
  value: Record<TOptions, boolean>;
  onChange: (value: Record<TOptions, boolean>) => void;
}) => {
  const [internalState] = useState({ value: props.value });
  return (
    <>
      <div className="card mb-2">
        <label>{props.parameter.label}</label>
        <div className="flex-wrap">
          {Object.keys(props.value || {}).length > 0 ? (
            Object.entries<boolean>(props.value)
              .filter((entry): entry is [TOptions, boolean] =>
                props.parameter.options.includes(entry[0]),
              )
              .map(([key, value], index) => {
                const [toggleValue, setToggleValue] = useState(value);

                const onChange = (e: ToggleButtonChangeEvent) => {
                  const newValue = e.value;
                  internalState.value[key] = newValue;
                  setToggleValue(newValue);
                  props.onChange(internalState.value);
                };
                return (
                  // <div key={index} className="">
                  //   {/* <label>{key}</label> */}
                  <StyledToggleButton
                    key={index}
                    invalid
                    onLabel={key}
                    offLabel={key}
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    checked={toggleValue}
                    onChange={onChange}
                    className="p-0 m-1 flex-1"
                  />
                  // </div>
                );
              })
          ) : (
            <div className="w-full">No Options Provided</div>
          )}
        </div>
      </div>
    </>
  );
};
