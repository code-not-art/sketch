import React from 'react';
import styled from 'styled-components';

import Sketch from '../sketch';

const FullscreenWrapper = styled('div')`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background: #e2d1d9;

  display: flex;
  justify-content: center;
  align-items: center;
`;

styled;

const Page = (props: { sketch: Sketch }) => {
  return (
    <>
      <FullscreenWrapper>
        <div id="canvas-wrapper">
          <canvas data-download="placeholder" id="sketch-canvas"></canvas>
        </div>
      </FullscreenWrapper>
      <a id="canvas-downloader" download=""></a>
    </>
  );
};

export default Page;
