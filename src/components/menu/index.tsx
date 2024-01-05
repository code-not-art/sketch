import { Color } from '@code-not-art/core';
import { debounce } from 'lodash';
import ControlPanel, {
  Checkbox,
  Color as ColorControl,
  Interval,
  Multibox,
  Range,
  Select,
  Text,
} from 'react-control-panel';
import { styled } from 'styled-components';
import { MOBILE_WIDTH_BREAKPOINT } from '../../components/constants.js';
import { Parameter, ParameterType } from '../../sketch/Params.js';
import { ParameterModel } from '../../sketch/Sketch.js';
import ImageState from '../state/ImageState.js';
import CollapsibleSection from './CollapsibleSection.js';
import SummarySection from './SummarySection.js';

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
  if (parameter.type === ParameterType.Header) {
    // This parameter is a header, create a new section
    sections.push({ title: parameter.display, params: [] });
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

const renderParam = (section: string) => (param: Parameter, index: number) => {
  const elementKey = `${section}-${index}-${param.display}`;
  switch (param.type) {
    case ParameterType.Checkbox:
      return <Checkbox key={elementKey} label={param.display}></Checkbox>;
    case ParameterType.Color:
      return (
        <ColorControl
          key={elementKey}
          label={param.display}
          format="hex"
        ></ColorControl>
      );
    case ParameterType.Range:
      return (
        <Range
          key={elementKey}
          label={param.display}
          min={param.options.min || Math.min(0, param.value)}
          max={param.options.max || Math.max(1, param.value)}
          step={param.options.step || 0.01}
        ></Range>
      );
    case ParameterType.Interval:
      return (
        <Interval
          key={elementKey}
          label={param.display}
          min={param.options.min || Math.min(0, param.values[0])}
          max={param.options.max || Math.max(1, param.values[1])}
          step={param.options.step || 0.01}
        ></Interval>
      );
    case ParameterType.Select:
      return (
        <Select
          key={elementKey}
          label={param.display}
          options={param.options || []}
        />
      );
    case ParameterType.MultiSelect:
      const labels = Object.keys(param.values || {});
      return (
        <Multibox
          key={elementKey}
          label={param.display}
          colors={
            labels?.map((option) => new Color({ seed: option }).rgb()) || []
          }
          names={labels}
        />
      );
    default:
      console.log(
        `Parameter type not handled in sketch menu:`,
        JSON.stringify(param),
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

type MenuProps<Params extends ParameterModel> = {
  params: Params;
  updateHandler: (property: string, value: any, updatedState: Params) => void;
  debounce?: number;
  imageState: ImageState;
};

function Menu<Params extends ParameterModel>(props: MenuProps<Params>) {
  const debounceTime = props.debounce === undefined ? 25 : props.debounce;
  const debouncedUpdate = debounce(props.updateHandler, debounceTime);

  const sections = Object.values(props.params).reduce<Section[]>(
    sectionReducer,
    [],
  );

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
}

export default Menu;
