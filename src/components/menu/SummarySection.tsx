import React, { useState, useEffect } from 'react';
import ImageState from '../page/ImageState';
import styled from 'styled-components';

import CollapsibleSection from './CollapsibleSection';

const Row = styled.div`
  height: 20px;
`;

const Label = styled.span`
  color: rgb(235, 235, 235);
  margin-right: 5px;
`;

const Value = styled.span`
  color: rgb(170, 170, 170);
  user-select: text;
`;

const formatDrawTime = (time: number) => {
  switch (true) {
    case time > 1000:
      const seconds = time / 1000;
      return seconds + ' s';
    default:
      return time + ' ms';
  }
};

const SummarySection = ({ state: state }: { state: ImageState }) => {
  const [drawTime, setDrawTime] = useState<number | undefined>();
  useEffect(() => {
    const renderTimeFetcher = setInterval(() => {
      const time = state.getRenderTime();
      if (time !== undefined) {
        clearInterval(renderTimeFetcher);
        setDrawTime(time);
      }
    });
    return () => {
      clearInterval(renderTimeFetcher);
    };
  });
  return (
    <CollapsibleSection title="Current Sketch">
      <Row>
        <Label>image:</Label>
        <Value>{state.getImage()}</Value>
      </Row>
      <Row>
        <Label>color:</Label>
        <Value>{state.getColor()}</Value>
      </Row>
      <br />
      <Row>
        <Label>draw time:</Label>
        <Value>
          {drawTime === undefined ? '--' : formatDrawTime(drawTime)}
        </Value>
      </Row>
    </CollapsibleSection>
  );
};

export default SummarySection;
