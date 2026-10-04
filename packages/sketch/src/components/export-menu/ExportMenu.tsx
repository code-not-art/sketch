import { Button } from 'primereact/button';
import { styled } from 'styled-components';
import { CollapsibleSection } from '../control-panel/CollapsibleSection.js';
import { SectionWrapper } from '../control-panel/SectionWrapper.js';

// Match the label color used by the rest of the menu
const ExportButton = styled(Button)`
	&.p-button,
	&.p-button .p-button-label {
		color: rgb(235, 235, 235);
	}
`;

/**
 * Menu section with buttons to export the current image as PNG or SVG.
 *
 * @param props.hasSvg Whether the sketch has drawn an SVG. The SVG button is disabled when `false`.
 * @param props.onExportPng Called when the PNG button is pressed.
 * @param props.onExportSvg Called when the SVG button is pressed.
 */
export const ExportMenu = (props: { hasSvg: boolean; onExportPng: () => void; onExportSvg: () => void }) => {
	return (
		<SectionWrapper>
			<CollapsibleSection title="Export" startCollapsed={true}>
				<div className={'flex gap-2'}>
					<ExportButton label="PNG" size="small" onClick={props.onExportPng} />
					<ExportButton label="SVG" size="small" disabled={!props.hasSvg} onClick={props.onExportSvg} />
				</div>
			</CollapsibleSection>
		</SectionWrapper>
	);
};
