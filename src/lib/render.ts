import { loop } from 'svelte/internal';
import type { PartData } from './parts';

export const BOT_SCALE = 4;

async function waitForLoad(image: HTMLImageElement): Promise<HTMLImageElement> {
	if (image.complete) {
		return Promise.resolve(image);
	} else {
		return new Promise((resolve) => {
			image.onload = () => {
				resolve(image);
			};
		});
	}
}

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
	svgs: Map<string, HTMLImageElement>;
	assets: Promise<void>;
	constructor() {
		this.svgs = new Map();
	}

	getSvg(path: string): Promise<HTMLImageElement> {
		if (!this.svgs.has(path)) {
			return new Promise((resolve) => {
				if (!this.assets) {
					this.assets = fetch('/assets.json')
						.then((response) => response.text())
						.then((text) => {
							const files = JSON.parse(text);
							return Promise.all(
								Object.keys(files).map((filename) => this.putSvg(filename, files[filename]))
							);
						})
						.then();
				}
				this.assets.then(() => {
					resolve(this.svgs.get(path));
				});
			});
		}
		return Promise.resolve(this.svgs.get(path));
	}

	async putSvg(path: string, dataUrl: string): Promise<HTMLImageElement> {
		const xmlSvg = this.fromDataUrl(dataUrl);
		const svgDocument = new DOMParser().parseFromString(xmlSvg, 'image/svg+xml');
		const svgElement = svgDocument.documentElement as unknown as SVGSVGElement;
		const width = Math.floor(svgElement.width.baseVal.value);
		const height = Math.floor(svgElement.height.baseVal.value);
		if (width !== 0 && height !== 0) {
			svgElement.width.baseVal.valueAsString = width.toString();
			svgElement.height.baseVal.valueAsString = height.toString();
		}
		const fixedDataUrl = this.toDataUrl(new XMLSerializer().serializeToString(svgDocument));
		const image = new Image();
		image.src = fixedDataUrl;
		this.svgs.set(path, image);
		return waitForLoad(image);
	}

	private fromDataUrl(dataUrl: string): string {
		const b64Encoding = dataUrl.replace('data:image/svg+xml;base64,', '');
		return window.atob(b64Encoding);
	}

	private toDataUrl(text: string): string {
		const base64EncodedSVG = window.btoa(text);
		return 'data:image/svg+xml;base64,' + base64EncodedSVG;
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
		image.width = part.width;
		image.height = part.height;
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

export function downloadAsImage(canvas: HTMLCanvasElement, type: string, downloadName: string) {
	const data = canvas.toDataURL('image/' + type);
	const downloadLink = document.createElement('a') as HTMLAnchorElement;
	downloadLink.href = data;
	downloadLink.download = downloadName + '.' + type;
	downloadLink.click();
}

export function downloadAssets() {
	const request = new XMLHttpRequest();
	request.onload = () => {
		const files = JSON.parse(request.response);
		for (const filename in files) {
			svgDirectory.putSvg(filename, files[filename]);
		}
	};
	request.open('GET', '/assets.json');
	request.send();
}
