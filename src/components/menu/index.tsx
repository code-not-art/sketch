import React from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

import ControlPanel from 'react-control-panel';
import { Checkbox, Interval, Range, Text } from 'react-control-panel';
import { Params } from 'src/sketch';
import StringMap from 'types/StringMap';

const FixedPositionWrapper = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
`;

const SectionHeader = styled.div`
  width: 100%;
  text-align: right;
  color: rgb(130, 130, 130);
  text-transform: uppercase;
  height: 20px;
  margin-bottom: 2px;
  margin-top: 12px;
`;

const Menu = (props: {
  sketchParameters: Params;
  params: StringMap<any>;
  updateHandler: (
    property: string,
    value: any,
    updatedState: StringMap<any>,
  ) => void;
  debounce?: number;
}) => {
  const debounceTime = props.debounce || 25;
  const debouncedUpdate = debounce(props.updateHandler, debounceTime);

  const renderParams = () => {
    return (
      <>
        {props.sketchParameters.map((p, i) => {
          const elementKey = `${i}-${p.key}`;
          switch (typeof p.value) {
            case 'boolean':
              return <Checkbox key={elementKey} label={p.key}></Checkbox>;
              break;
            case 'number':
              return (
                <Range
                  key={elementKey}
                  label={p.key}
                  min={p.min || Math.min(0, p.value)}
                  max={p.max || Math.max(1, p.value)}
                  step={p.step || 0.01}
                ></Range>
              );
              break;
            case 'object':
              if (Array.isArray(p.value) && p.value.length === 2) {
                return (
                  <Interval
                    key={elementKey}
                    label={p.key}
                    min={p.min || Math.min(0, p.value[0])}
                    max={p.max || Math.max(1, p.value[1])}
                    step={p.step || 0.01}
                  ></Interval>
                );
              }
            // NO BREAK HERE, fall through when the if case doesn't catch the param
            default:
              console.log(
                `Parameter not displayed due to unknown type:`,
                p.key,
                typeof p.value,
              );
              return null;
              break;
          }
        })}
      </>
    );
  };

  return (
    <FixedPositionWrapper>
      <ControlPanel
        width={350}
        // initialState={{ image: 'hello', ...props.params }}
        theme="dark"
        title="Make Code Not Art"
        initialState={props.params}
        onChange={debouncedUpdate}
      >
        {/* Sketch Summary Header Goes Here*/}
        <SectionHeader>Custom Seeds</SectionHeader>
        <Text label="image"></Text>
        <Text label="color"></Text>
        <SectionHeader>Sketch Parameters!</SectionHeader>
        {renderParams()}
      </ControlPanel>
    </FixedPositionWrapper>
  );
};

export default Menu;
