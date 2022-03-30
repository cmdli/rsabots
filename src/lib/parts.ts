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
	let index;
	if (rng) {
		index = Math.floor(rng.random() * selection.length);
	} else {
		index = Math.floor(Math.random() * selection.length);
	}
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

const leftEyes = [
	new PartData('eye-left-angry.png', 16, 14, new Anchor(0.5, 0.5)),
	new PartData('eye-left-sad.png', 21, 19, new Anchor(0.5, 0.5)),
	new PartData('eye-frown.png', 16, 8, new Anchor(0.5, 0.5)),
	new PartData('eye-round.png', 14, 14, new Anchor(0.5, 0.5)),
	new PartData('eye-smile.png', 16, 8, new Anchor(0.5, 0.5)),
	new PartData('eye-left-bored.png', 16, 2, new Anchor(0.5, 0.5)),
	new PartData('eye-left-slant.png', 13, 13, new Anchor(0.5, 0.5))
];
const eyes = leftEyes.map((eye) => [new Pattern(eye), new Pattern(eye.flipHorizontal())]);
const shiftyEye = new PartData('eye-left-shifty.png', 16, 11, new Anchor(0.5, 0.5));
eyes.push([new Pattern(shiftyEye), new Pattern(shiftyEye)]);

const mouths = [
	new Pattern(new PartData('mouth-scowl.png', 22, 14, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-straight.png', 21, 12, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-grin.png', 22, 14, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-small.png', 9, 4, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-smirk.png', 21, 7, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-surprise.png', 14, 11, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-tongue.png', 21, 9, new Anchor(0.5, 0.5))),
	new Pattern(new PartData('mouth-disappoint.png', 20, 5, new Anchor(0.5, 0.5)))
];

const faces = [
	new Pattern(new PartData('face-bullet.png', 72, 88, new Anchor(0.5, 0.9)))
		.addChoice([new Anchor(0.35, 0.3), new Anchor(0.75, 0.3)], eyes)
		.addChoice(new Anchor(0.55, 0.55), mouths),
	new Pattern(new PartData('face-diamond.png', 93, 68, new Anchor(0.5, 0.9)))
		.addChoice([new Anchor(0.33, 0.45), new Anchor(0.66, 0.45)], eyes)
		.addChoice(new Anchor(0.5, 0.75), mouths),
	new Pattern(new PartData('face-cap.png', 79, 51, new Anchor(0.5, 0.8)))
		.addChoice([new Anchor(0.25, 0.5), new Anchor(0.75, 0.5)], eyes)
		.addChoice(new Anchor(0.5, 0.7), mouths),
	new Pattern(new PartData('face-circle.png', 75, 66, new Anchor(0.5, 0.8)))
		.addChoice([new Anchor(0.25, 0.45), new Anchor(0.75, 0.35)], eyes)
		.addChoice(new Anchor(0.55, 0.75), mouths),
	new Pattern(new PartData('face-drill.png', 83, 76, new Anchor(0.5, 0.8)))
		.addChoice([new Anchor(0.3, 0.25), new Anchor(0.7, 0.25)], eyes)
		.addChoice(new Anchor(0.5, 0.65), mouths),
	new Pattern(new PartData('face-hexagon.png', 79, 72, new Anchor(0.5, 0.8)))
		.addChoice([new Anchor(0.25, 0.45), new Anchor(0.75, 0.45)], eyes)
		.addChoice(new Anchor(0.45, 0.7), mouths),
	new Pattern(new PartData('face-peanut.png', 108, 66, new Anchor(0.5, 0.9)))
		.addChoice([new Anchor(0.25, 0.4), new Anchor(0.75, 0.4)], eyes)
		.addChoice(new Anchor(0.5, 0.4), mouths),
	new Pattern(new PartData('face-pyramid.png', 83, 76, new Anchor(0.5, 0.9)))
		.addChoice([new Anchor(0.25, 0.75), new Anchor(0.75, 0.75)], eyes)
		.addChoice(new Anchor(0.5, 0.4), mouths),
	new Pattern(new PartData('face-star.png', 105, 105, new Anchor(0.5, 0.8)))
		.addChoice([new Anchor(0.3, 0.5), new Anchor(0.7, 0.5)], eyes)
		.addChoice(new Anchor(0.5, 0.65), mouths)
];

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
		.addChoice([new Anchor(0.35, 0.75, -1), new Anchor(0.65, 0.75, -1)], legPairs),
	new Pattern(new PartData('body-circle.png', 110, 104, new Anchor(0.5, 0.5)))
		.addChoice(new Anchor(0.5, 0.2), faces)
		.addChoice(new Anchor(0.9, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.1, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.2, 0.8, -1), new Anchor(0.8, 0.8, -1)], legPairs),
	new Pattern(new PartData('body-drill.png', 105, 95, new Anchor(0.5, 0.5)))
		.addChoice(new Anchor(0.5, 0.1), faces)
		.addChoice(new Anchor(0.7, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.3, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.4, 0.7, -1), new Anchor(0.6, 0.7, -1)], legPairs),
	new Pattern(new PartData('body-hexagon.png', 106, 97, new Anchor(0.5, 0.5)))
		.addChoice(new Anchor(0.5, 0.1), faces)
		.addChoice(new Anchor(0.8, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.2, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.3, 0.8, -1), new Anchor(0.7, 0.8, -1)], legPairs),
	// new Pattern(new PartData('body-peanut.png', 70, 127, new Anchor(0.5, 0.5)))
	// 	.addChoice(new Anchor(0.5, 0.1), faces)
	// 	.addChoice(new Anchor(0.8, 0.25, -1), rightArms)
	// 	.addChoice(new Anchor(0.2, 0.25, -1), leftArms)
	// 	.addChoice([new Anchor(0.2, 0.75, -1), new Anchor(0.8, 0.75, -1)], legPairs),
	new Pattern(new PartData('body-star.png', 91, 91, new Anchor(0.5, 0.5)))
		.addChoice(new Anchor(0.5, 0.2), faces)
		.addChoice(new Anchor(0.9, 0.2, -1), rightArms)
		.addChoice(new Anchor(0.1, 0.2, -1), leftArms)
		.addChoice([new Anchor(0.1, 0.8, -1), new Anchor(0.9, 0.8, -1)], legPairs)
	// new Pattern(new PartData('body-tee.png', 84, 92, new Anchor(0.5, 0.5)))
	// 	.addChoice(new Anchor(0.5, 0.1), faces)
	// 	.addChoice(new Anchor(0.9, 0.2, -1), rightArms)
	// 	.addChoice(new Anchor(0.1, 0.2, -1), leftArms)
	// 	.addChoice([new Anchor(0.45, 0.8, -1), new Anchor(0.55, 0.8, -1)], legPairs)
];

export const rootPattern = new Pattern(new PartData(null, 450, 300)).addChoice(
	new Anchor(0.5, 0.5),
	bodies
);
