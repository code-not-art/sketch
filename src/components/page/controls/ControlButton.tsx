import React, { TouchEventHandler } from 'react';
import styled from 'styled-components';
import { Icon } from 'react-feather';

const Button = styled.div`
  background-color: rgb(30, 30, 30, 0.7);
  padding: 5px;
`;

const EnabledButton = styled(Button)`
  :active {
    color: rgb(235, 235, 235);
    background-color: rgb(60, 60, 60, 0.7);
  }
`;

const DisabledButton = styled(Button)`
  color: rgb(40, 40, 40);
`;

export type ControlButtonProps = {
  children?: React.ReactNode;
  onTouch: TouchEventHandler;
  disabled: boolean;
};
const ControlButton = ({ children, onTouch, disabled }: ControlButtonProps) => {
  const Component = disabled ? DisabledButton : EnabledButton;
  return (
    <Component onTouchEnd={(e) => disabled || onTouch(e)}>{children}</Component>
  );
};

export default ControlButton;
