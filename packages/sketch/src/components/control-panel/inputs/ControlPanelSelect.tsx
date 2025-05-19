import { useState } from 'react';
import type { ControlPanelParameterSelect } from '../../../control-panel/types/parameters.js';

import { ToggleButton, type ToggleButtonChangeEvent } from 'primereact/togglebutton';
import { styled } from 'styled-components';
import { Dropdown } from 'primereact/dropdown';

const StyledDropdown = styled(Dropdown)`
	.p-inputtext {
		padding: 0.15rem 0.35rem;
	}
`;

export const ControlPanelSelect = <TOptions extends string>(props: {
	parameter: ControlPanelParameterSelect;
	value: TOptions;
	onChange: (value: TOptions) => void;
}) => {
	const [internalState, setInternalState] = useState(props.value);
	const internalOnChange = (newValue?: TOptions) => {
		if (newValue) {
			setInternalState(newValue);
			props.onChange(newValue);
		}
	};
	return (
		<>
			<div className="card mb-2">
				<label>{props.parameter.label}</label>
				<div className="flex-wrap">
					{props.parameter.options.length > 0 ? (
						<StyledDropdown
							value={internalState}
							onChange={(event) => internalOnChange(event.value)}
							options={[...props.parameter.options]}
							optionLabel={props.parameter.label}
						/>
					) : (
						<div className="w-full">No Options Provided</div>
					)}
				</div>
			</div>
		</>
	);
};
