import { useState } from 'react';
import type { ControlPanelParameterNumber } from '../../../control-panel/types/parameters.js';
import { styled } from 'styled-components';
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';

const StyledInput = styled(InputNumber)`
	height: 1.6rem;

	input {
		margin: 0;
		font-family: monospace;
		font-size: 0.75rem;
		background: black;
		padding: 0.2rem 0.4rem;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}

	.p-inputtext:enabled:focus {
		outline: 0 none;
		outline-offset: 0;
		box-shadow: 0 0 0 0rem rgba(251, 191, 36, 0.2);
		border-color: none;
	}

	.p-button {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
		padding: 0;
		width: 1.5rem;
		background-color: #464646;
		color: var(--yellow-500);
		border: 0;
	}
`;

export const ControlPanelNumber = (props: {
	parameter: ControlPanelParameterNumber;
	value: number;
	onChange: (value: number) => void;
}) => {
	const { parameter, value, onChange } = props;

	const [internalValue, setInternalValue] = useState(value);

	const changeHandler = (eventValue: number) => {
		setInternalValue(eventValue);
		onChange(eventValue);
	};
	return (
		<>
			<div className="card flex justify-content-center mb-2">
				<div className="w-full">
					<label>{parameter.label}</label>
					<StyledInput
						className=" w-full"
						value={internalValue}
						onChange={(e) => e.value !== null && changeHandler(e.value)}
						min={parameter.min}
						max={parameter.max}
						step={parameter.step * 5}
						showButtons
						buttonLayout="horizontal"
						incrementButtonIcon="pi pi-plus"
						decrementButtonIcon="pi pi-minus"
						style={{
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
							padding: 0,
						}}
					/>
					<Slider
						className="w-full"
						value={internalValue}
						onChange={(e) => typeof e.value === 'number' && changeHandler(e.value)}
						min={parameter.min}
						max={parameter.max}
						step={parameter.step}
						style={{ borderRadius: 0, height: '0.5rem' }}
					/>
				</div>
			</div>
		</>
	);
};
