import { Helmet } from 'react-helmet';

import { FullPageSketch } from './components/index.js';
import { ParameterModel, SketchDefinition } from 'sketch/Sketch.js';

const App = <Params extends ParameterModel, DataModel extends object>({
  sketch,
  title = 'Code Sketch',
  description = 'HTML Canvas sketch made by code',
}: {
  sketch: SketchDefinition<Params, DataModel>;
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
