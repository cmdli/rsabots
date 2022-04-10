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
	name: string | null;
	type: string | null;
	color: string | null;
	width: number;
	height: number;
	socket: Anchor;
	anchors: [Anchor, PartData][];
	flipX: boolean;
	flipY: boolean;
	constructor(
		type: string | null,
		name: string | null,
		width: number,
		height: number,
		socket?: Anchor,
		flipX?: boolean,
		flipY?: boolean
	) {
		this.anchors = [];
		this.type = type;
		this.name = name;
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
			this.type,
			this.name,
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

function randomChoice<A>(selection: A[], rng?: Random): A {
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
	colors: string[];
	choices: ChoiceSelection[];

	constructor(basePattern: PartData, colors: string[]) {
		this.basePattern = basePattern;
		this.colors = colors;
		this.choices = [];
	}

	addChoice(anchors: Anchor | Anchor[], patterns: Pattern[] | Pattern[][]): Pattern {
		const selection = makeChoice(anchors, patterns);
		this.choices.push(selection);
		return this;
	}

	resolve(rng?: Random): PartData {
		const result = this.basePattern.clone();
		result.color = randomChoice(this.colors, rng);
		for (const choice of this.choices) {
			const choiceResult = randomChoice(choice, rng);
			for (const [anchor, pattern] of choiceResult) {
				result.addSubpart(anchor, pattern.resolve(rng));
			}
		}
		return result;
	}
}

const UNCOLORED = ['none'];
const METAL_COLORS = ['steel', 'silver', 'copper', 'gold'];

const leftEyes = [
	new PartData('eye', 'angry', 16, 14, new Anchor(0.5, 0.5)),
	new PartData('eye', 'sad', 21, 19, new Anchor(0.5, 0.5)),
	new PartData('eye', 'frown', 16, 8, new Anchor(0.5, 0.5)),
	new PartData('eye', 'round', 14, 14, new Anchor(0.5, 0.5)),
	new PartData('eye', 'smile', 16, 8, new Anchor(0.5, 0.5)),
	new PartData('eye', 'bored', 16, 2, new Anchor(0.5, 0.5)),
	new PartData('eye', 'slant', 13, 13, new Anchor(0.5, 0.5))
];
const eyes = leftEyes.map((eye) => [
	new Pattern(eye, UNCOLORED),
	new Pattern(eye.flipHorizontal(), UNCOLORED)
]);
// Add shift eyes after because they aren't supposed to be flipped
const shiftyEye = new PartData('eye', 'shifty', 16, 11, new Anchor(0.5, 0.5));
eyes.push([new Pattern(shiftyEye, UNCOLORED), new Pattern(shiftyEye, UNCOLORED)]);

const mouths = [
	new PartData('mouth', 'scowl', 22, 14, new Anchor(0.5, 0.5)),
	new PartData('mouth', 'straight', 21, 12, new Anchor(0.5, 0.5)),
	new PartData('mouth', 'grin', 22, 14, new Anchor(0.5, 0.5)),
	new PartData('mouth', 'small', 9, 4, new Anchor(0.5, 0.5)),
	new PartData('mouth', 'smirk', 21, 7, new Anchor(0.5, 0.5)),
	new PartData('mouth', 'surprise', 14, 11, new Anchor(0.5, 0.5)),
	new PartData('mouth', 'tongue', 21, 9, new Anchor(0.5, 0.5)),
	new PartData('mouth', 'disappoint', 20, 5, new Anchor(0.5, 0.5))
].map((data) => new Pattern(data, UNCOLORED));

const antennaeData = [
	new PartData('antenna', 'circles', 27, 28, new Anchor(0.1, 0.9)),
	new PartData('antenna', 'dish', 30, 27, new Anchor(0.1, 0.9)),
	new PartData('antenna', 'flop', 46, 19, new Anchor(0.1, 0.9)),
	new PartData('antenna', 'fork', 37, 36, new Anchor(0.1, 0.9)),
	new PartData('antenna', 'ray', 27, 26, new Anchor(0.1, 0.9)),
	new PartData('antenna', 'sphere', 40, 38, new Anchor(0.1, 0.9)),
	new PartData('antenna', 'square', 34, 33, new Anchor(0.1, 0.9)),
	new PartData('antenna', 'star', 24, 24, new Anchor(0.1, 0.9))
];
const rightAntennae = antennaeData.map((data) => new Pattern(data, UNCOLORED));
const leftAntennae = antennaeData.map((data) => new Pattern(data.flipHorizontal(), UNCOLORED));

const symbols = [
	new PartData('symbol', 'c', 15, 19, new Anchor(0.5, 0.5)),
	new PartData('symbol', 'diamond', 22, 19, new Anchor(0.5, 0.5)),
	new PartData('symbol', 'eye', 25, 18, new Anchor(0.5, 0.5)),
	new PartData('symbol', 'octagon', 23, 23, new Anchor(0.5, 0.5)),
	new PartData('symbol', 'star-6', 22, 24, new Anchor(0.5, 0.5)),
	new PartData('symbol', 'star', 24, 24, new Anchor(0.5, 0.5)),
	new PartData('symbol', 'x', 19, 19, new Anchor(0.5, 0.5)),
	new PartData(null, null, 10, 10, new Anchor(0.5, 0.5))
].map((data) => new Pattern(data, UNCOLORED));

const faces = [
	new Pattern(new PartData('face', 'bullet', 72, 88, new Anchor(0.5, 0.9)), UNCOLORED)
		.addChoice([new Anchor(0.35, 0.3), new Anchor(0.75, 0.3)], eyes)
		.addChoice(new Anchor(0.55, 0.55), mouths)
		.addChoice(new Anchor(0.85, 0.12, -1), rightAntennae)
		.addChoice(new Anchor(0.15, 0.12, -1), leftAntennae),
	new Pattern(new PartData('face', 'diamond', 93, 68, new Anchor(0.5, 0.9)), UNCOLORED)
		.addChoice([new Anchor(0.33, 0.45), new Anchor(0.66, 0.45)], eyes)
		.addChoice(new Anchor(0.5, 0.75), mouths)
		.addChoice(new Anchor(0.75, 0.3, -1), rightAntennae)
		.addChoice(new Anchor(0.25, 0.3, -1), leftAntennae),
	new Pattern(new PartData('face', 'cap', 79, 51, new Anchor(0.5, 0.8)), UNCOLORED)
		.addChoice([new Anchor(0.25, 0.5), new Anchor(0.75, 0.5)], eyes)
		.addChoice(new Anchor(0.5, 0.7), mouths)
		.addChoice(new Anchor(0.8, 0.3, -1), rightAntennae)
		.addChoice(new Anchor(0.2, 0.3, -1), leftAntennae),
	new Pattern(new PartData('face', 'circle', 75, 66, new Anchor(0.5, 0.8)), UNCOLORED)
		.addChoice([new Anchor(0.25, 0.45), new Anchor(0.75, 0.35)], eyes)
		.addChoice(new Anchor(0.55, 0.75), mouths)
		.addChoice(new Anchor(0.8, 0.2, -1), rightAntennae)
		.addChoice(new Anchor(0.2, 0.2, -1), leftAntennae),
	new Pattern(new PartData('face', 'drill', 83, 76, new Anchor(0.5, 0.8)), UNCOLORED)
		.addChoice([new Anchor(0.3, 0.25), new Anchor(0.7, 0.25)], eyes)
		.addChoice(new Anchor(0.5, 0.65), mouths)
		.addChoice(new Anchor(0.95, 0.12, -1), rightAntennae)
		.addChoice(new Anchor(0.05, 0.12, -1), leftAntennae),
	new Pattern(new PartData('face', 'hexagon', 79, 72, new Anchor(0.5, 0.8)), UNCOLORED)
		.addChoice([new Anchor(0.25, 0.45), new Anchor(0.75, 0.45)], eyes)
		.addChoice(new Anchor(0.45, 0.7), mouths)
		.addChoice(new Anchor(0.75, 0.1, -1), rightAntennae)
		.addChoice(new Anchor(0.25, 0.1, -1), leftAntennae),
	new Pattern(new PartData('face', 'peanut', 108, 66, new Anchor(0.5, 0.9)), UNCOLORED)
		.addChoice([new Anchor(0.25, 0.4), new Anchor(0.75, 0.4)], eyes)
		.addChoice(new Anchor(0.5, 0.4), mouths)
		.addChoice(new Anchor(0.9, 0.15, -1), rightAntennae)
		.addChoice(new Anchor(0.1, 0.15, -1), leftAntennae),
	new Pattern(new PartData('face', 'pyramid', 83, 76, new Anchor(0.5, 0.9)), UNCOLORED)
		.addChoice([new Anchor(0.25, 0.75), new Anchor(0.75, 0.75)], eyes)
		.addChoice(new Anchor(0.5, 0.4), mouths)
		.addChoice(new Anchor(0.7, 0.25, -1), rightAntennae)
		.addChoice(new Anchor(0.3, 0.25, -1), leftAntennae),
	new Pattern(new PartData('face', 'star', 105, 105, new Anchor(0.5, 0.8)), UNCOLORED)
		.addChoice([new Anchor(0.3, 0.5), new Anchor(0.7, 0.5)], eyes)
		.addChoice(new Anchor(0.5, 0.65), mouths)
		.addChoice(new Anchor(0.8, 0.4, -1), rightAntennae)
		.addChoice(new Anchor(0.2, 0.4, -1), leftAntennae)
];

const armsData = [
	new PartData('arm', 'angle', 107, 76, new Anchor(0.05, 0.8)),
	new PartData('arm', 'diamond', 102, 63, new Anchor(0.05, 0.5)),
	new PartData('arm', 'lift', 101, 96, new Anchor(0.05, 0.4)),
	new PartData('arm', 'round', 117, 67, new Anchor(0.05, 0.8)),
	new PartData('arm', 'scifi', 104, 85, new Anchor(0.05, 0.5)),
	new PartData('arm', 'scissors', 105, 81, new Anchor(0.05, 0.45)),
	new PartData('arm', 'square', 77, 69, new Anchor(0.1, 0.8)),
	new PartData('arm', 'straight', 90, 65, new Anchor(0.08, 0.25))
];
const rightArms = armsData.map((data) => new Pattern(data, UNCOLORED));
const leftArms = armsData.map((data) => new Pattern(data.flipHorizontal(), UNCOLORED));

const legData = [
	new PartData('leg', 'angle', 66, 90, new Anchor(0.27, 0.1)),
	new PartData('leg', 'bearing', 45, 88, new Anchor(0.35, 0.1)),
	new PartData('leg', 'diamond', 51, 89, new Anchor(0.5, 0.1)),
	new PartData('leg', 'round', 101, 95, new Anchor(0.15, 0.15)),
	new PartData('leg', 'straight', 32, 89, new Anchor(0.5, 0.1)),
	new PartData('leg', 'telescope', 57, 91, new Anchor(0.35, 0.1))
];
const legPairs = legData.map((data) => [
	new Pattern(data.flipHorizontal(), UNCOLORED),
	new Pattern(data, UNCOLORED)
]);

const bodies = [
	new Pattern(new PartData('body', 'square', 80, 115, new Anchor(0.5, 0.5)), UNCOLORED)
		.addChoice(new Anchor(0.5, 0.05), faces)
		.addChoice(new Anchor(0.8, 0.4, -1), rightArms)
		.addChoice(new Anchor(0.2, 0.4, -1), leftArms)
		.addChoice([new Anchor(0.2, 0.9, -1), new Anchor(0.8, 0.9, -1)], legPairs)
		.addChoice(new Anchor(0.7, 0.3), symbols),
	new Pattern(new PartData('body', 'diamond', 142, 103, new Anchor(0.5, 0.5)), UNCOLORED)
		.addChoice(new Anchor(0.5, 0.2), faces)
		.addChoice(new Anchor(0.9, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.1, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.35, 0.75, -1), new Anchor(0.65, 0.75, -1)], legPairs)
		.addChoice(new Anchor(0.3, 0.4), symbols),
	new Pattern(new PartData('body', 'circle', 110, 104, new Anchor(0.5, 0.5)), UNCOLORED)
		.addChoice(new Anchor(0.5, 0.2), faces)
		.addChoice(new Anchor(0.9, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.1, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.2, 0.8, -1), new Anchor(0.8, 0.8, -1)], legPairs)
		.addChoice(new Anchor(0.4, 0.7), symbols),
	new Pattern(new PartData('body', 'drill', 105, 95, new Anchor(0.5, 0.5)), UNCOLORED)
		.addChoice(new Anchor(0.5, 0.1), faces)
		.addChoice(new Anchor(0.7, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.3, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.4, 0.7, -1), new Anchor(0.6, 0.7, -1)], legPairs)
		.addChoice(new Anchor(0.7, 0.3), symbols),
	new Pattern(new PartData('body', 'hexagon', 106, 97, new Anchor(0.5, 0.5)), UNCOLORED)
		.addChoice(new Anchor(0.5, 0.1), faces)
		.addChoice(new Anchor(0.8, 0.5, -1), rightArms)
		.addChoice(new Anchor(0.2, 0.5, -1), leftArms)
		.addChoice([new Anchor(0.3, 0.8, -1), new Anchor(0.7, 0.8, -1)], legPairs)
		.addChoice(new Anchor(0.5, 0.5), symbols),
	// new Pattern(new PartData('body-peanut', 70, 127, new Anchor(0.5, 0.5)))
	// 	.addChoice(new Anchor(0.5, 0.1), faces)
	// 	.addChoice(new Anchor(0.8, 0.25, -1), rightArms)
	// 	.addChoice(new Anchor(0.2, 0.25, -1), leftArms)
	// 	.addChoice([new Anchor(0.2, 0.75, -1), new Anchor(0.8, 0.75, -1)], legPairs),
	new Pattern(new PartData('body', 'star', 91, 91, new Anchor(0.5, 0.5)), UNCOLORED)
		.addChoice(new Anchor(0.5, 0.2), faces)
		.addChoice(new Anchor(0.9, 0.2, -1), rightArms)
		.addChoice(new Anchor(0.1, 0.2, -1), leftArms)
		.addChoice([new Anchor(0.1, 0.8, -1), new Anchor(0.9, 0.8, -1)], legPairs)
		.addChoice(new Anchor(0.7, 0.7), symbols)
	// new Pattern(new PartData('body-tee', 84, 92, new Anchor(0.5, 0.5)))
	// 	.addChoice(new Anchor(0.5, 0.1), faces)
	// 	.addChoice(new Anchor(0.9, 0.2, -1), rightArms)
	// 	.addChoice(new Anchor(0.1, 0.2, -1), leftArms)
	// 	.addChoice([new Anchor(0.45, 0.8, -1), new Anchor(0.55, 0.8, -1)], legPairs)
];

export const rootPattern = new Pattern(new PartData(null, null, 525, 350), UNCOLORED).addChoice(
	new Anchor(0.5, 0.5),
	bodies
);
