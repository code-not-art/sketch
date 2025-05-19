import { InputSwitch } from 'primereact/inputswitch';
import { useState } from 'react';
import { styled } from 'styled-components';
import type { ControlPanelParameterBoolean } from '../../../control-panel/types/parameters.js';

const StyledInput = styled(InputSwitch)`
	height: 1.6rem;

	margin-left: 0.5rem;

	input {
		margin: 0;
		font-family: monospace;
		font-size: 0.75rem;
		background: black;
		padding: 0.2rem 0.4rem;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}
`;

export const ControlPanelBoolean = (props: {
	parameter: ControlPanelParameterBoolean;
	value: boolean;
	onChange: (value: boolean) => void;
}) => {
	const { parameter, value, onChange } = props;

	const [internalValue, setInternalValue] = useState(value);

	const changeHandler = (eventValue: boolean) => {
		setInternalValue(eventValue);
		onChange(eventValue);
	};
	return (
		<>
			<div className="card flex  justify-content-center mb-2">
				<div className="w-full align-items-center flex">
					<label>{parameter.label}</label>
					<StyledInput checked={internalValue} onChange={(event) => changeHandler(event.target.value)} />
				</div>
			</div>
		</>
	);
};
