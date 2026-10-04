/**
 * Save a blob as a file by clicking a temporary download link.
 *
 * @param blob Content of the file.
 * @param filename Name suggested to the browser for the saved file, including extension.
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

/**
 * Save an SVG document string as an `.svg` file.
 *
 * @param svg Complete SVG document.
 * @param filename Name suggested to the browser for the saved file, including extension.
 */
export function exportSvg(svg: string, filename: string): void {
	downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

/**
 * Save the content of an HTML canvas as a `.png` file.
 *
 * @param canvas Canvas element to capture.
 * @param filename Name suggested to the browser for the saved file, including extension.
 * @returns Promise that resolves once the download has been triggered. Rejects if the browser cannot encode the canvas.
 */
export function exportPng(canvas: HTMLCanvasElement, filename: string): Promise<void> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob === null) {
				reject(new Error('Could not encode canvas as PNG'));
				return;
			}
			downloadBlob(blob, filename);
			resolve();
		}, 'image/png');
	});
}

/**
 * Build the file name used when exporting an image.
 *
 * @param inputs.image Image seed of the current image.
 * @param inputs.color Color seed of the current image.
 * @param inputs.extension File extension without a leading dot.
 * @returns File name in the form `<image> - <color>.<extension>`.
 */
export function exportFilename(inputs: { image: string; color: string; extension: string }): string {
	return `${inputs.image} - ${inputs.color}.${inputs.extension}`;
}
