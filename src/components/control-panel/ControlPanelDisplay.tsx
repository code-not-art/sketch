import { PrimeReactProvider } from 'primereact/api';
import { useState } from 'react';
import {
  type ControlPanelConfig,
  type ControlPanelElement,
  type ControlPanelParameterValues,
} from '../../control-panel/types/controlPanel.js';
import { CollapsibleSection } from './CollapsibleSection.js';
import { ControlPanelNumber } from './inputs/ControlPanelNumber.js';
import { ControlPanelString } from './inputs/ControlPanelString.js';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-dark-amber/theme.css';
import { SectionWrapper } from './SectionWrapper.js';

export const ControlPanelDisplay = <
  TPanel extends ControlPanelConfig<Record<string, ControlPanelElement<any>>>,
>(props: {
  config: TPanel;
  initialValues: ControlPanelParameterValues<TPanel>;
  updateHandler: (
    updates: Partial<ControlPanelParameterValues<TPanel>>,
    newValues: ControlPanelParameterValues<TPanel>,
  ) => void;
}) => {
  const { config, updateHandler, initialValues } = props;

  const RecursiveRenderSection = <
    TSection extends ControlPanelConfig<
      Record<string, ControlPanelElement<any>>
    >,
  >(recursiveProps: {
    config: TSection;
    values: ControlPanelParameterValues<TSection>;
    updateHandler: (
      updates: Partial<ControlPanelParameterValues<TPanel>>,
      newValues: ControlPanelParameterValues<TPanel>,
    ) => void;
  }) => {
    const [valueWrapper] = useState({ values: recursiveProps.values });
    return (
      <>
        {Object.entries(recursiveProps.config.elements).map(
          ([key, element]) => {
            const value = valueWrapper.values[key];
            if ('dataType' in element) {
              switch (element.dataType) {
                case 'string': {
                  return (
                    <ControlPanelString
                      key={key}
                      parameter={element}
                      value={value}
                      onChange={(updatedValue) => {
                        valueWrapper.values = {
                          ...valueWrapper.values,
                          [key]: updatedValue,
                        };
                        recursiveProps.updateHandler(
                          { [key]: updatedValue } as Partial<
                            ControlPanelParameterValues<TPanel>
                          >,
                          valueWrapper.values,
                        );
                      }}
                    />
                  );
                }
                case 'number': {
                  return (
                    <ControlPanelNumber
                      key={key}
                      parameter={element}
                      value={value}
                      onChange={(updatedValue) => {
                        valueWrapper.values = {
                          ...valueWrapper.values,
                          [key]: updatedValue,
                        };
                        recursiveProps.updateHandler(
                          { [key]: updatedValue } as Partial<
                            ControlPanelParameterValues<TPanel>
                          >,
                          valueWrapper.values,
                        );
                      }}
                    />
                  );
                }
              }
            } else {
              return (
                <CollapsibleSection title={element.title}>
                  <RecursiveRenderSection
                    key={`${key}`}
                    config={element}
                    values={value}
                    updateHandler={(updates, newValues) => {
                      recursiveProps.updateHandler(
                        { [key]: updates } as Partial<
                          ControlPanelParameterValues<TPanel>
                        >,
                        { ...recursiveProps.values, [key]: newValues },
                      );
                    }}
                  />
                </CollapsibleSection>
              );
            }
          },
        )}
      </>
    );
  };
  return (
    <PrimeReactProvider>
      <SectionWrapper>
        <CollapsibleSection title={config.title}>
          <RecursiveRenderSection
            config={config}
            values={initialValues}
            updateHandler={updateHandler}
          />
        </CollapsibleSection>
      </SectionWrapper>
    </PrimeReactProvider>
  );
};
