import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronsDown } from 'react-feather';

const SectionHeader = styled.div`
  width: 100%;
  text-align: right;
  color: rgb(170, 170, 170);
  text-transform: uppercase;
  height: 20px;
  margin-bottom: 2px;
  margin-top: 12px;

  :hover {
    color: rgb(235, 235, 235);
    cursor: pointer;
  }

  svg.collapsed {
    transform: rotate(0deg);
    transition: transform 0.2s linear;
  }
  svg.open {
    transform: rotate(180deg);
    transition: transform 0.2s linear;
  }
`;

const CollapsibleWrapper = styled.div`
  div.collapsed {
    overflow: hidden;
    max-height: 0px;
    transition: max-height 300ms;
  }
  div.open {
    overflow-y: show;
    max-height: 400px;
    transition: max-height 300ms;
  }
`;

const CollapsibleSection = ({
  title,
  initialState = false,
  children,
}: {
  title: string;
  initialState?: boolean;
  children?: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(initialState);
  const toggleState = () => {
    setCollapsed(!collapsed);
  };
  return (
    <CollapsibleWrapper>
      <SectionHeader onClick={toggleState}>
        {title}
        <ChevronsDown
          size={14}
          style={{ marginBottom: -3 }}
          className={collapsed ? 'collapsed' : 'open'}
        />
      </SectionHeader>

      <div className={collapsed ? 'collapsed' : 'open'}>{children}</div>
    </CollapsibleWrapper>
  );
};

export default CollapsibleSection;
