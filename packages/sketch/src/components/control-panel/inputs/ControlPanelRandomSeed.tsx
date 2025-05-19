import { InputNumber } from 'primereact/inputnumber';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import type { ControlPanelParameterRandomSeed } from '../../../control-panel/types/parameters.js';

const ValueDisplay = styled.span`
	margin-left: 1rem;
	color: rgb(170, 170, 170);
`;

const StyledButton = styled.button`
	margin-left: 0.5rem;
`;
export const ControlPanelRandomSeed = (props: {
	parameter: ControlPanelParameterRandomSeed;
	value: number;
	onChange: (value: number) => void;
}) => {
	const { parameter, value, onChange } = props;

	const [seedHistory, setSeedHistory] = useState({
		values: [value],
		activeIndex: 0,
	});

	useEffect(() => onChange(getActiveValue()), [seedHistory]);

	const getActiveValue = () => seedHistory.values[seedHistory.activeIndex];
	const randomValue = () => {
		const newValue = Math.random();
		const values = [...seedHistory.values, newValue];
		setSeedHistory({
			values,
			activeIndex: values.length - 1,
		});
	};
	const nextValue = () => {
		if (seedHistory.activeIndex < seedHistory.values.length - 1) {
			setSeedHistory({
				...seedHistory,
				activeIndex: seedHistory.activeIndex + 1,
			});
		} else {
			randomValue();
		}
	};
	const previousValue = () => {
		if (seedHistory.activeIndex > 0) {
			setSeedHistory({
				...seedHistory,
				activeIndex: seedHistory.activeIndex - 1,
			});
		}
	};
	return (
		<>
			<div className="card flex align-items-center justify-content-center mb-2 ">
				<div className="w-full">
					<label>{parameter.label}</label>
					<ValueDisplay>{getActiveValue()}</ValueDisplay> <br />
					<StyledButton disabled={!parameter.editable || seedHistory.activeIndex === 0} onClick={previousValue}>
						Previous
					</StyledButton>
					<StyledButton disabled={!parameter.editable} onClick={nextValue}>
						Next
					</StyledButton>
					<StyledButton disabled={!parameter.editable} onClick={randomValue}>
						Random
					</StyledButton>
				</div>
			</div>
		</>
	);
};
