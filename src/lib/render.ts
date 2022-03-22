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

const imageDirectory = new ImageDirectory();

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
			console.log(anchorX, anchorY);
			await renderPart(context, subpart, x + anchorX, y + anchorY);
			context.fillRect(x + anchorX - 2, y + anchorY - 2, 4, 4);
		}
	}
	console.log('Drawing', part.imagePath, x, y);
	if (part.imagePath) {
		const image = await imageDirectory.getImage('/static/botparts/' + part.imagePath);
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
		context.fillStyle = 'red';
		context.fillRect(0, 0, 2, 2);
		context.drawImage(image, 0, 0, part.width * BOT_SCALE, part.height * BOT_SCALE);
		context.restore();
	}
	for (const [anchor, subpart] of part.anchors) {
		if (anchor.zDelta >= 0) {
			const anchorX = Math.floor(anchor.x * part.width) * BOT_SCALE;
			const anchorY = Math.floor(anchor.y * part.height) * BOT_SCALE;
			console.log(anchorX, anchorY);
			await renderPart(context, subpart, x + anchorX, y + anchorY);
			context.fillRect(x + anchorX - 2, y + anchorY - 2, 4, 4);
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
