import { styled } from 'styled-components';
import { MOBILE_WIDTH_BREAKPOINT } from '../constants.js';
import {
  ParameterModel,
  ParameterModelValues,
} from '../../sketch/params/types.js';
import {
  type ControlPanelConfig,
  type ControlPanelElement,
  type ControlPanelParameterValue,
  type ControlPanelParameterValues,
} from '../../control-panel/types/controlPanel.js';
import type { ControlPanelParameter } from '../../control-panel/types/parameters.js';

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

// const sectionReducer = (sections: Section[], parameter: Parameter) => {
//   if (parameter.type === ParameterType.Header) {
//     // This parameter is a header, create a new section
//     sections.push({ title: parameter.display, params: [] });
//     return sections;
//   }
//   if (sections.length === 0) {
//     // The first parameter provided isnt a header, so put in a default header
//     sections.push({ title: 'Custom Parameters', params: [] });
//   }
//   const section = sections[sections.length - 1];
//   section.params.push(parameter);
//   return sections;
// };

// const ControlPanelElement = (props: {
//   element: ControlPanelConfig<any> | ControlPanelParameter;
// 	values:
// }) => {
// 	if('dataType' in props.element){
// 		return <div>{props.element.label}: </div>
// 	}
// 	return <>Element</>;}

export const ControlPanelDisplay = <
  TPanel extends ControlPanelConfig<Record<string, ControlPanelElement<any>>>,
>(props: {
  config: TPanel;
  values: ControlPanelParameterValues<TPanel>;
  updateHandler: (
    updates: Partial<ControlPanelParameterValues<TPanel>>,
    newValues: ControlPanelParameterValues<TPanel>,
  ) => void;
}) => {
  const { config, updateHandler, values } = props;

  const RecursiveRenderSection = <
    TSection extends ControlPanelConfig<
      Record<string, ControlPanelElement<any>>
    >,
  >(recursiveProps: {
    config: TSection;
    values: ControlPanelParameterValues<TSection>;
  }) => {
    return (
      <>
        <div>{recursiveProps.config.title}</div>
        {recursiveProps.config.description && (
          <div>{recursiveProps.config.description}</div>
        )}
        {Object.entries(recursiveProps.config.elements).map(
          ([key, element]) => {
            const value = recursiveProps.values[key];
            if ('dataType' in element) {
              return (
                <div>
                  {element.label}: {value}
                </div>
              );
            } else {
              return <RecursiveRenderSection config={element} values={value} />;
            }
          },
        )}
      </>
    );
  };
  return (
    <FixedPositionWrapper>
      <RecursiveRenderSection config={config} values={values} />
    </FixedPositionWrapper>
  );
};
