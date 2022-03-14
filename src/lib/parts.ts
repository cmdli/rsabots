import { zip } from '$lib/util';

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
		copy.socket.x = copy.width - copy.socket.x;
		copy.flipX = !copy.flipX;
		return copy;
	}

	flipVertical(): PartData {
		const copy = this.clone();
		copy.socket.y = copy.height - copy.socket.y;
		copy.flipY = !copy.flipY;
		return copy;
	}
}

type ChoiceResult = [Anchor, Pattern][];
type ChoiceSelection = ChoiceResult[];

function randomChoice(selection: ChoiceSelection): ChoiceResult {
	// TODO: Deterministically choose
	const index = Math.floor(Math.random() * selection.length);
	return selection[index];
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

	resolve(): PartData {
		const result = this.basePattern.clone();
		for (const choice of this.choices) {
			const choiceResult = randomChoice(choice);
			for (const [anchor, pattern] of choiceResult) {
				result.addSubpart(anchor, pattern.resolve());
			}
		}
		return result;
	}
}

const angryEyes = [
	new Pattern(new PartData('eye-left-angry.svg', 30, 30, new Anchor(15, 15))),
	new Pattern(new PartData('eye-right-angry.svg', 30, 30, new Anchor(15, 15)))
];
const sadEyes = [
	new Pattern(new PartData('eye-left-sad.svg', 30, 30, new Anchor(15, 15))),
	new Pattern(new PartData('eye-right-sad.svg', 30, 30, new Anchor(15, 15)))
];
const eyes = [angryEyes, sadEyes];

const mouths = [
	new Pattern(new PartData('mouth-scowl.svg', 40, 20, new Anchor(20, 10))),
	new Pattern(new PartData('mouth-straight.svg', 40, 20, new Anchor(20, 10)))
];

const bulletFace = new Pattern(new PartData('face-bullet.svg', 100, 125, new Anchor(50, 110)))
	.addChoice([new Anchor(30, 45), new Anchor(70, 45)], eyes)
	.addChoice(new Anchor(50, 80), mouths);

const diamondFace = new Pattern(new PartData('face-diamond.svg', 150, 100, new Anchor(75, 90)))
	.addChoice([new Anchor(50, 45), new Anchor(100, 45)], eyes)
	.addChoice(new Anchor(75, 75), mouths);

const faces = [bulletFace, diamondFace];

const armsData = [
	new PartData('arm-right-bearing.svg', 150, 150, new Anchor(10, 115)),
	new PartData('arm-right-diamond.svg', 150, 150, new Anchor(10, 75)),
	new PartData('arm-right-lift.svg', 130, 130, new Anchor(10, 50)),
	new PartData('arm-right-round.svg', 150, 150, new Anchor(10, 95)),
	new PartData('arm-right-scifi.svg', 130, 130, new Anchor(10, 63)),
	new PartData('arm-right-scissor.svg', 130, 130, new Anchor(10, 59)),
	new PartData('arm-right-square.svg', 130, 130, new Anchor(20, 105)),
	new PartData('arm-right-straight.svg', 130, 130, new Anchor(15, 33))
];
const rightArms = armsData.map((data) => new Pattern(data));
const leftArms = armsData.map((data) => new Pattern(data.flipHorizontal()));

const bodies = [
	new Pattern(new PartData('body-square.svg', 100, 150, new Anchor(50, 75)))
		.addChoice(new Anchor(50, 10), faces)
		.addChoice(new Anchor(80, 60, -1), rightArms)
		.addChoice(new Anchor(20, 60, -1), leftArms),
	new Pattern(new PartData('body-diamond.svg', 200, 150, new Anchor(100, 75)))
		.addChoice(new Anchor(100, 30), faces)
		.addChoice(new Anchor(180, 75, -1), rightArms)
		.addChoice(new Anchor(20, 75, -1), leftArms)
];

export const rootPattern = new Pattern(new PartData(null, 400, 400)).addChoice(
	new Anchor(200, 200),
	bodies
);
