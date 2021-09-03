import React from 'react';
import { Helmet } from 'react-helmet';
import Page from './components/Page';

import Sketch from './sketch';

const emptySketch: Sketch = {
  config: {},
  params: {},
  init: ({}) => {},
  draw: ({}) => {},
  loop: ({}) => {},
  reset: () => {},
};

const App = () => {
  return (
    <>
      <Helmet>
        <title>Make Code Sketch</title>
        <meta name="description" content="Canvas sketch made by code" />
      </Helmet>
      <Page sketch={emptySketch}></Page>
    </>
  );
};
export default App;
