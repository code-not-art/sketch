import React from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

import ControlPanel from 'react-control-panel';
import { Checkbox, Interval, Range, Text } from 'react-control-panel';

import CollapsibleSection from './CollapsibleSection';
import { Parameter, ParameterType } from '../../sketch/Params';
import StringMap from 'utils/StringMap';
import { MOBILE_WIDTH_BREAKPOINT } from '../../components/constants';
import ImageState from '../../components/page/ImageState';
import SummarySection from './SummarySection';

const FixedPositionWrapper = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;

  @media only screen and (max-width: ${MOBILE_WIDTH_BREAKPOINT}px) {
    position: static;
    width: 100%;
    max-height: 50%;
    overflow: auto;

    .control-panel {
      width: 100% !important;
    }
  }
`;

type Section = {
  title: string;
  params: Parameter[];
};
const sectionReducer = (sections: Section[], parameter: Parameter) => {
  if (parameter.value === undefined) {
    // This parameter is a header, create a new section
    sections.push({ title: parameter.key, params: [] });
    return sections;
  }
  if (sections.length === 0) {
    // The first parameter provided isnt a header, so put in a default header
    sections.push({ title: 'Custom Parameters', params: [] });
  }
  const section = sections[sections.length - 1];
  section.params.push(parameter);
  return sections;
};

const renderParam = (section: string) => (param: Parameter) => {
  const elementKey = `${section}-${param.key}`;
  switch (param.type) {
    case ParameterType.Checkbox:
      return <Checkbox key={elementKey} label={param.key}></Checkbox>;
    case ParameterType.Range:
      return (
        <Range
          key={elementKey}
          label={param.key}
          min={param?.rangeOptions?.min || Math.min(0, param.value)}
          max={param?.rangeOptions?.max || Math.max(1, param.value)}
          step={param?.rangeOptions?.step || 0.01}
        ></Range>
      );
    case ParameterType.Interval:
      if (Array.isArray(param.value) && param.value.length === 2) {
        return (
          <Interval
            key={elementKey}
            label={param.key}
            min={param?.rangeOptions?.min || Math.min(0, param.value[0])}
            max={param?.rangeOptions?.max || Math.max(1, param.value[1])}
            step={param?.rangeOptions?.step || 0.01}
          ></Interval>
        );
      }
    default:
      console.log(
        `Parameter not displayed due to unknown type:`,
        JSON.stringify(param),
        typeof param.value,
      );
      return null;
  }
};

const renderSections = (sections: Section[]) => {
  return (
    <>
      {sections.map((section, index) => (
        <CollapsibleSection
          key={`${index}-${section.title}`}
          title={section.title}
          initialState={window.innerWidth <= MOBILE_WIDTH_BREAKPOINT}
        >
          {section.params.map(renderParam(section.title))}
        </CollapsibleSection>
      ))}
    </>
  );
};

const Menu = (props: {
  sketchParameters: Parameter[];
  params: StringMap<any>;
  updateHandler: (
    property: string,
    value: any,
    updatedState: StringMap<any>,
  ) => void;
  debounce?: number;
  imageState: ImageState;
}) => {
  const debounceTime = props.debounce === undefined ? 25 : props.debounce;
  const debouncedUpdate = debounce(props.updateHandler, debounceTime);

  const sections = props.sketchParameters.reduce<Section[]>(sectionReducer, []);

  return (
    <FixedPositionWrapper>
      <ControlPanel
        width={350}
        theme="dark"
        title="Make Code Not Art"
        initialState={props.params}
        onChange={debouncedUpdate}
      >
        <SummarySection state={props.imageState} />
        {/* Sketch Summary Header Goes Here*/}
        <CollapsibleSection
          title="Custom Seeds"
          initialState={window.innerWidth <= MOBILE_WIDTH_BREAKPOINT}
        >
          <Text label="image"></Text>
          <Text label="color"></Text>
        </CollapsibleSection>
        {renderSections(sections)}
      </ControlPanel>
    </FixedPositionWrapper>
  );
};

export default Menu;
