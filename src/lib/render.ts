import type { PartData } from './parts';

export const BOT_SCALE = 4;

class ImageDirectory {
	images: Map<string, Promise<HTMLImageElement>>;
	constructor() {
		this.images = new Map();
	}

	getImage(path: string): Promise<HTMLImageElement> {
		if (!this.images.has(path)) {
			const promise: Promise<HTMLImageElement> = new Promise((resolve) => {
				const image = new Image();
				image.onload = () => {
					resolve(image);
				};
				image.src = path;
			});
			this.images.set(path, promise);
		}
		return this.images.get(path);
	}
}

class SvgDirectory {
	svgs: Map<string, Promise<HTMLImageElement>>;
	constructor() {
		this.svgs = new Map();
	}

	getSvg(path: string): Promise<HTMLImageElement> {
		if (!this.svgs.has(path)) {
			const promise = fetch(path)
				.then((response) => response.text())
				.then((text) => {
					const svgDocument = new DOMParser().parseFromString(text, 'image/svg+xml');
					const svgElement = svgDocument.documentElement as unknown as SVGSVGElement;
					svgElement.width.baseVal.valueAsString = svgElement.width.baseVal.value.toString();
					svgElement.height.baseVal.valueAsString = svgElement.height.baseVal.value.toString();
					const base64EncodedSVG = window.btoa(new XMLSerializer().serializeToString(svgDocument));
					const image = new Image();
					image.src = 'data:image/svg+xml;base64,' + base64EncodedSVG;
					return image;
				});
			this.svgs.set(path, promise);
		}
		return this.svgs.get(path);
	}
}

const imageDirectory = new ImageDirectory();
const svgDirectory = new SvgDirectory();

export async function renderPart(
	context: CanvasRenderingContext2D,
	part: PartData,
	x: number,
	y: number
) {
	const socketX = Math.floor(part.socket.x * part.width) * BOT_SCALE;
	const socketY = Math.floor(part.socket.y * part.height) * BOT_SCALE;
	x = x - socketX;
	y = y - socketY;

	for (const [anchor, subpart] of part.anchors) {
		if (anchor.zDelta < 0) {
			const anchorX = Math.floor(anchor.x * part.width) * BOT_SCALE;
			const anchorY = Math.floor(anchor.y * part.height) * BOT_SCALE;
			await renderPart(context, subpart, x + anchorX, y + anchorY);
		}
	}
	if (part.name) {
		const path = '/botparts/' + part.type + '/' + part.color + '/' + part.name + '.svg';
		const image = await svgDirectory.getSvg(path);
		context.save();
		context.resetTransform();
		context.translate(x, y);
		if (part.flipX) {
			context.scale(-1, 1);
			context.translate(-(BOT_SCALE * part.width), 0);
		}
		if (part.flipY) {
			context.scale(1, -1);
			context.translate(0, -(BOT_SCALE * part.height));
		}
		context.drawImage(image, 0, 0, part.width * BOT_SCALE, part.height * BOT_SCALE);
		context.restore();
	}
	for (const [anchor, subpart] of part.anchors) {
		if (anchor.zDelta >= 0) {
			const anchorX = Math.floor(anchor.x * part.width) * BOT_SCALE;
			const anchorY = Math.floor(anchor.y * part.height) * BOT_SCALE;
			await renderPart(context, subpart, x + anchorX, y + anchorY);
		}
	}
}

export async function renderDebugOverlay(
	context: CanvasRenderingContext2D,
	part: PartData,
	x: number,
	y: number
) {
	context.fillStyle = 'red';
	context.fillRect(x - 2 * BOT_SCALE, y - 2 * BOT_SCALE, 4 * BOT_SCALE, 4 * BOT_SCALE);
	const socketX = Math.floor(part.socket.x * part.width) * BOT_SCALE;
	const socketY = Math.floor(part.socket.y * part.height) * BOT_SCALE;
	x = x - socketX;
	y = y - socketY;

	for (const [anchor, subpart] of part.anchors) {
		if (anchor.zDelta < 0) {
			const anchorX = Math.floor(anchor.x * part.width) * BOT_SCALE;
			const anchorY = Math.floor(anchor.y * part.height) * BOT_SCALE;
			await renderDebugOverlay(context, subpart, x + anchorX, y + anchorY);
		}
	}
	for (const [anchor, subpart] of part.anchors) {
		if (anchor.zDelta >= 0) {
			const anchorX = Math.floor(anchor.x * part.width) * BOT_SCALE;
			const anchorY = Math.floor(anchor.y * part.height) * BOT_SCALE;
			await renderDebugOverlay(context, subpart, x + anchorX, y + anchorY);
		}
	}
}

export function downloadAsImage(canvas: HTMLCanvasElement, downloadName: string) {
	const data = canvas.toDataURL('image/png');
	const downloadLink = document.createElement('a') as HTMLAnchorElement;
	downloadLink.href = data;
	downloadLink.download = downloadName;
	downloadLink.click();
}
