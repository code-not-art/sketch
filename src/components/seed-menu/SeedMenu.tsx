import { useState, type ChangeEventHandler } from 'react';
import type ImageState from '../state/ImageState.js';
import { SectionWrapper } from '../control-panel/SectionWrapper.js';
import { CollapsibleSection } from '../control-panel/CollapsibleSection.js';
import { ControlPanelString } from '../control-panel/inputs/ControlPanelString.js';
import { Parameters } from '../../control-panel/Parameters.js';
import { InputText } from 'primereact/inputtext';
import type { ArgumentsType } from 'vitest';

type InputChangeHandler = ArgumentsType<typeof InputText>[0]['onChange'];

export const SeedMenu = (props: {
  state: ImageState;
  onChange: (updatedState: { image: string; color: string }) => void;
}) => {
  console.log('jno - rendering seedmenu');

  const [image, setImage] = useState(props.state.userImageSeed || '');
  const [color, setColor] = useState(props.state.userColorSeed || '');
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
      <CollapsibleSection title="Seeds">
        <div>
          <label>Image</label>
          <InputText
            value={image}
            placeholder={props.state.getImage()}
            onChange={onImageChange}
          />
        </div>
        <div>
          <label>Color</label>
          <InputText
            value={color}
            placeholder={props.state.getColor()}
            onChange={onColorChange}
          />
        </div>
      </CollapsibleSection>
    </SectionWrapper>
  );
};
