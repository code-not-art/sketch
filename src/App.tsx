import React from 'react';
import { Helmet } from 'react-helmet';
import Page from './components/Page';

import Sketch, { Config, Params } from './sketch';

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
      <iframe
        src="https://giphy.com/embed/82CItLnbSh8hzsXK3H"
        width="268"
        height="480"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe>
      <iframe
        src="https://giphy.com/embed/MWKh2LORVFR8jtX1Lm"
        width="298"
        height="480"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe>
    </>
  );
};
export default App;
