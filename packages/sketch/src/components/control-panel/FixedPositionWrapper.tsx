import type { PropsWithChildren } from 'react';
import { styled } from 'styled-components';
import { MOBILE_WIDTH_BREAKPOINT } from '../constants.js';

const FixedPositionDiv = styled.div<{
	$vertical: 'top' | 'bottom';
	$horizontal: 'left' | 'right';
}>`
	position: fixed;
	${(props) => (props.$vertical === 'top' ? 'top: 0px;' : 'bottom: 0px;')}
	${(props) => (props.$horizontal === 'left' ? 'left: 0px;' : 'right: 0px;')}
	max-height: 100%;
	overflow-y: auto;
	width: 20%;
	min-width: 300px;

	@media only screen and (max-width: ${MOBILE_WIDTH_BREAKPOINT}px) {
		width: 100%;
		max-height: 50%;
		overflow: auto;

		.control-panel {
			width: 100% !important;
		}
	}
`;

export const FixedPositionWrapper = (
	props: PropsWithChildren<{
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'right';
	}>,
) => {
	return (
		<FixedPositionDiv $vertical={props.vertical} $horizontal={props.horizontal}>
			{props.children}
		</FixedPositionDiv>
	);
};
