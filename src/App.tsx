import { Helmet } from 'react-helmet';

import { SketchDefinition } from './sketch/index.js';
import { FullPageSketch } from './components/index.js';
import type {
  ControlPanelConfig,
  ControlPanelElement,
} from './control-panel/types/controlPanel.js';

const App = <
  TParameters extends Record<string, ControlPanelElement<any>>,
  DataModel extends object,
>({
  sketch,
  title = 'Code Sketch',
  description = 'HTML Canvas sketch made by code',
}: {
  sketch: SketchDefinition<TParameters, DataModel>;
  title?: string;
  description?: string;
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <FullPageSketch sketch={sketch}></FullPageSketch>
    </>
  );
};
export default App;
