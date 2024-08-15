import type {
  ControlPanelConfig,
  ControlPanelElement,
} from './types/controlPanel.js';

export const ControlPanel = <
  TShape extends Record<string, ControlPanelElement<any>>,
>(
  title: string,
  elements: ControlPanelConfig<TShape>['elements'],
  options?: { description?: string },
): ControlPanelConfig<TShape> => {
  return { title, description: options?.description, elements };
};
