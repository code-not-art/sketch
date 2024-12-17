import React, { useState } from 'react';
import { styled } from 'styled-components';
import { ChevronsDown } from 'react-feather';

const SectionHeader = styled.div`
	width: 100%;
	text-align: right;
	color: rgb(170, 170, 170);
	text-transform: uppercase;
	height: 20px;
	margin-bottom: 2px;
	margin-top: 12px;
	font-size: 0.7rem;

	:hover {
		cursor: pointer;
		color: rgb(235, 235, 235);
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
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	div.collapsed {
		overflow: hidden;
		max-height: 0px;
		transition: max-height 300ms;
	}
	div.open {
		overflow-y: show;
		transition: max-height 300ms;
	}
`;

export const CollapsibleSection = ({
	title,
	startCollapsed = false,
	children,
}: {
	title: string;
	startCollapsed?: boolean;
	children?: React.ReactNode;
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(startCollapsed);
	const toggleState = () => {
		setCollapsed(!collapsed);
	};
	return (
		<CollapsibleWrapper>
			<SectionHeader onClick={toggleState}>
				<span>
					{title}
					<ChevronsDown size={14} style={{ marginBottom: -3 }} className={collapsed ? 'collapsed' : 'open'} />
				</span>
			</SectionHeader>

			<div className={collapsed ? 'collapsed' : 'open'}>{children}</div>
		</CollapsibleWrapper>
	);
};
