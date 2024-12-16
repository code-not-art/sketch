import type {
  ControlPanelConfig,
  ControlPanelElements,
} from './types/controlPanel.js';

export const ControlPanel = <TShape extends ControlPanelElements>(
  title: string,
  elements: ControlPanelConfig<TShape>['elements'],
  options?: { description?: string; collapsed?: boolean },
): ControlPanelConfig<TShape> => {
  return {
    title,
    description: options?.description,
    elements,
    startCollapsed: !!options?.collapsed,
  };
};
