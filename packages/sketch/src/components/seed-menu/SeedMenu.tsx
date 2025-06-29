import { useState, type ChangeEventHandler } from 'react';
import type ImageState from '../state/ImageState.js';
import { SectionWrapper } from '../control-panel/SectionWrapper.js';
import { CollapsibleSection } from '../control-panel/CollapsibleSection.js';
import { ControlPanelString } from '../control-panel/inputs/ControlPanelString.js';
import { Parameters } from '../../control-panel/Parameters.js';
import { InputText } from 'primereact/inputtext';
import type { ArgumentsType } from 'vitest';
import { styled } from 'styled-components';

type InputChangeHandler = ArgumentsType<typeof InputText>[0]['onChange'];

const PaletteWrapper = styled.div`
	display: flex;
	width: 100%;
	/* background-color: white; */
	height: 2rem;
`;
const PaletteSwatch = styled.div<{ color: string }>`
	flex: 1;
	background-color: ${(props) => props.color};
`;

export const SeedMenu = (props: {
	state: ImageState;
	onChange: (updatedState: { image: string; color: string }) => void;
}) => {
	const [image, setImage] = useState(props.state.getImage());
	const [color, setColor] = useState(props.state.getColor());
	const [, _forceUpdate] = useState<void>();

	const onImageChange: InputChangeHandler = (e) => {
		const updatedImage = e.target.value;
		setImage(updatedImage);
		props.onChange({ image: updatedImage, color });
	};
	const onColorChange: InputChangeHandler = (e) => {
		const updatedColor = e.target.value;
		setColor(updatedColor);
		props.onChange({ image, color: updatedColor });
	};

	return (
		<SectionWrapper>
			<CollapsibleSection title="Seeds" startCollapsed={true}>
				<div className={'mb-2'}>
					<label>Image</label>
					<InputText value={image} placeholder={props.state.getImage()} onChange={onImageChange} />
				</div>
				<div>
					<label>Color</label>
					<InputText value={color} placeholder={props.state.getColor()} onChange={onColorChange} />
					<PaletteWrapper>
						<PaletteSwatch color={props.state.palette.colors[0].rgb()} />
						<PaletteSwatch color={props.state.palette.colors[1].rgb()} />
						<PaletteSwatch color={props.state.palette.colors[2].rgb()} />
						<PaletteSwatch color={props.state.palette.colors[3].rgb()} />
						<PaletteSwatch color={props.state.palette.colors[4].rgb()} />
					</PaletteWrapper>
				</div>
			</CollapsibleSection>
		</SectionWrapper>
	);
};
