import React from 'react';
import styled from 'styled-components';

import ControlPanel from 'react-control-panel';
import { Checkbox, Text } from 'react-control-panel';

const FixedPositionWrapper = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
`;

const SectionHeader = styled.div`
  width: 100%;
  text-align: center;
  color: rgb(130, 130, 130);
  text-transform: uppercase;
  height: 20px;
  margin-bottom: 4px;
  margin-top: 12px;
`;

const Menu = (props: { params: any }) => {
  return (
    <FixedPositionWrapper>
      <ControlPanel
        width={400}
        initialState={{ image: 'hello', ...props.params }}
        theme="dark"
        title="Make Code Not Art"
      >
        <SectionHeader>Custom Seeds</SectionHeader>
        <Text label="image"></Text>
        <Text label="color"></Text>
      </ControlPanel>
    </FixedPositionWrapper>
  );
};

export default Menu;
