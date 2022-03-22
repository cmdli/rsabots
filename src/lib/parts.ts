import { zip } from '$lib/util';
import type { Random } from './random';

export class Anchor {
	x: number;
	y: number;
	zDelta: number;
	constructor(x: number, y: number, zDelta: number = 1) {
		this.x = x;
		this.y = y;
		this.zDelta = zDelta;
	}

	clone(): Anchor {
		return new Anchor(this.x, this.y, this.zDelta);
	}
}

export class PartData {
	imagePath: string | null;
	width: number;
	height: number;
	socket: Anchor;
	anchors: [Anchor, PartData][];
	flipX: boolean;
	flipY: boolean;
	constructor(
		imagePath: string | null,
		width: number,
		height: number,
		socket?: Anchor,
		flipX?: boolean,
		flipY?: boolean
	) {
		this.anchors = [];
		this.imagePath = imagePath;
		this.width = width;
		this.height = height;
		this.socket = socket ?? new Anchor(0, 0);
		this.flipX = flipX ?? false;
		this.flipY = flipY ?? false;
	}

	addSubpart(anchor: Anchor, part: PartData) {
		this.anchors.push([anchor, part]);
		return this;
	}

	clone(): PartData {
		const copy = new PartData(
			this.imagePath,
			this.width,
			this.height,
			this.socket.clone(),
			this.flipX,
			this.flipY
		);

		for (const [anchor, part] of this.anchors) {
			copy.addSubpart(anchor, part);
		}
		return copy;
	}

	flipHorizontal(): PartData {
		const copy = this.clone();
		copy.socket.x = 1.0 - copy.socket.x;
		copy.flipX = !copy.flipX;
		return copy;
	}

	flipVertical(): PartData {
		const copy = this.clone();
		copy.socket.y = 1.0 - copy.socket.y;
		copy.flipY = !copy.flipY;
		return copy;
	}
}

type ChoiceResult = [Anchor, Pattern][];
type ChoiceSelection = ChoiceResult[];

function randomChoice(selection: ChoiceSelection, rng?: Random): ChoiceResult {
	if (rng) {
		let numBits = -1;
		let length = selection.length;
		while (length != 0) {
			length = length >> 1;
			numBits++;
		}
		const index = rng.getBits(numBits);
		return selection[index];
	} else {
		const index = Math.floor(Math.random() * selection.length);
		return selection[index];
	}
}

function makeChoice(anchors: Anchor[] | Anchor, choices: Pattern[][] | Pattern[]): ChoiceSelection {
	const result: ChoiceSelection = [];
	for (const patterns of choices) {
		if (!Array.isArray(patterns) && !Array.isArray(anchors)) {
			result.push([[anchors, patterns]]);
		} else if (Array.isArray(patterns) && Array.isArray(anchors)) {
			result.push(zip(anchors, patterns));
		}
	}
	return result;
}

class Pattern {
	basePattern: PartData;
	choices: ChoiceSelection[];

	constructor(basePattern: PartData) {
		this.basePattern = basePattern;
		this.choices = [];
	}

	addChoice(anchors: Anchor | Anchor[], patterns: Pattern[] | Pattern[][]): Pattern {
		const selection = makeChoice(anchors, patterns);
		this.choices.push(selection);
		return this;
	}

	resolve(rng?: Random): PartData {
		const result = this.basePattern.clone();
		for (const choice of this.choices) {
			const choiceResult = randomChoice(choice, rng);
			for (const [anchor, pattern] of choiceResult) {
				result.addSubpart(anchor, pattern.resolve(rng));
			}
		}
		return result;
	}
}

const angryEyes = [
	new Pattern(new PartData('eye-left-angry.png', 16, 14, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('eye-right-angry.png', 16, 14, new Anchor(0.5, 0.5)))
];
const sadEyes = [
	new Pattern(new PartData('eye-left-sad.png', 21, 19, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('eye-right-sad.png', 18, 17, new Anchor(0.5, 0.5)))
];
const eyes = [angryEyes, sadEyes];

const mouths = [
	new Pattern(new PartData('mouth-scowl.png', 20, 12, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-straight.png', 21, 12, new Anchor(0.5, 0.5)))
];

const bulletFace = new Pattern(new PartData('face-bullet.png', 72, 88, new Anchor(0.5, 0.9)))
	.addChoice([new Anchor(0.35, 0.3), new Anchor(0.75, 0.3)], eyes)
	.addChoice(new Anchor(0.55, 0.55), mouths);

const diamondFace = new Pattern(new PartData('face-diamond.png', 93, 68, new Anchor(0.5, 0.9)))
	.addChoice([new Anchor(0.33, 0.45), new Anchor(0.66, 0.45)], eyes)
	.addChoice(new Anchor(0.5, 0.75), mouths);

const faces = [bulletFace, diamondFace];

const armsData = [
	new PartData('arm-right-bearing.png', 107, 76, new Anchor(0.05, 0.8)),
	new PartData('arm-right-diamond.png', 102, 63, new Anchor(0.05, 0.5)),
	new PartData('arm-right-lift.png', 101, 96, new Anchor(0.05, 0.4)),
	new PartData('arm-right-round.png', 117, 67, new Anchor(0.05, 0.8)),
	new PartData('arm-right-scifi.png', 104, 85, new Anchor(0.05, 0.5)),
	new PartData('arm-right-scissor.png', 105, 81, new Anchor(0.05, 0.45)),
	new PartData('arm-right-square.png', 77, 69, new Anchor(0.1, 0.8)),
	new PartData('arm-right-straight.png', 90, 65, new Anchor(0.08, 0.25))
];
const rightArms = armsData.map((data) => new Pattern(data));
const leftArms = armsData.map((data) => new Pattern(data.flipHorizontal()));

const legData = [
	new PartData('leg-right-angle.png', 66, 90, new Anchor(0.27, 0.1)),
	new PartData('leg-right-bearing.png', 45, 88, new Anchor(0.35, 0.1)),
	new PartData('leg-right-diamond.png', 51, 89, new Anchor(0.5, 0.1)),
	new PartData('leg-right-round.png', 101, 95, new Anchor(0.15, 0.15)),
	new PartData('leg-right-straight.png', 32, 89, new Anchor(0.5, 0.1)),
	new PartData('leg-right-telescope.png', 57, 91, new Anchor(0.35, 0.1))
];
const legPairs = legData.map((data) => [new Pattern(data.flipHorizontal()), new Pattern(data)]);

const bodies = [
	new Pattern(new PartData('body-square.png', 80, 115, new Anchor(0.5, 0.5)))
		.addChoice(new Anchor(0.5, 0.05), faces)
		.addChoice(new Anchor(0.8, 0.4, -1), rightArms)
		.addChoice(new Anchor(0.2, 0.4, -1), leftArms)
		.addChoice([new Anchor(0.2, 0.9, -1), new Anchor(0.8, 0.9, -1)], legPairs),
	new Pattern(new PartData('body-diamond.png', 142, 103, new Anchor(0.5, 0.5)))
		.addChoice(new Anchor(0.5, 0.2), faces)
		.addChoice(new Anchor(0.9, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.1, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.35, 0.75, -1), new Anchor(0.65, 0.75, -1)], legPairs)
];

export const rootPattern = new Pattern(new PartData(null, 450, 300)).addChoice(
	new Anchor(0.5, 0.5),
	bodies
);
