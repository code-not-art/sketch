import type { PropsWithChildren } from 'react';
import { styled } from 'styled-components';
import { MOBILE_WIDTH_BREAKPOINT } from '../constants.js';

export const FixedPositionWrapper = (
  props: PropsWithChildren<{
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  }>,
) => {
  const FixedPositionDiv = styled.div`
    position: fixed;
    ${props.vertical === 'top' ? 'top: 0px;' : 'bottom: 0px;'}
    ${props.horizontal === 'left' ? 'left: 0px;' : 'right: 0px;'}

    @media only screen and (max-width: ${MOBILE_WIDTH_BREAKPOINT}px) {
      width: 100%;
      max-height: 50%;
      overflow: auto;

      .control-panel {
        width: 100% !important;
      }
    }
  `;
  return <FixedPositionDiv>{props.children}</FixedPositionDiv>;
};
