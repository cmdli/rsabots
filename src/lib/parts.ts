function zip<A, B>(array1: A[], array2: B[]): [A, B][] {
	const result: [A, B][] = [];
	for (let i = 0; i < array1.length; i++) {
		result.push([array1[i], array2[i]]);
	}
	return result;
}

export class PartData {
	imagePath: string | null;
	width: number;
	height: number;
	anchors: [Anchor, PartData][];
	constructor(imagePath: string | null, width: number, height: number) {
		this.anchors = [];
		this.imagePath = imagePath;
		this.width = width;
		this.height = height;
	}

	addAnchor(x: number, y: number, part: PartData) {
		this.anchors.push([[x, y], part]);
		return this;
	}
}

type Anchor = [number, number];
type ChoiceResult = [Anchor, Pattern][];
type ChoiceSelection = ChoiceResult[];

function randomChoice(selection: ChoiceSelection): ChoiceResult {
	// TODO: Randomly choose
	const index = Math.floor(Math.random() * selection.length);
	return selection[index];
}

function makeChoice(anchors: Anchor[], choices: Pattern[][]): ChoiceSelection {
	const result: ChoiceSelection = [];
	for (const patterns of choices) {
		result.push(zip(anchors, patterns));
	}
	return result;
}

class Pattern {
	background: string | null;
	width: number;
	height: number;
	choices: ChoiceSelection[];

	constructor(background: string | null, width: number, height: number) {
		this.background = background;
		this.choices = [];
		this.width = width;
		this.height = height;
	}

	addChoice(selection: ChoiceSelection): Pattern {
		this.choices.push(selection);
		return this;
	}

	resolve(): PartData {
		const result = new PartData(this.background, this.width, this.height);
		for (const choice of this.choices) {
			const choiceResult = randomChoice(choice);
			for (const [anchor, pattern] of choiceResult) {
				const [x, y] = anchor;
				result.addAnchor(x, y, pattern.resolve());
			}
		}
		return result;
	}
}

const angryEyes = [
	new Pattern('eye-left-angry.svg', 30, 30),
	new Pattern('eye-right-angry.svg', 30, 30)
];
const sadEyes = [new Pattern('eye-left-sad.svg', 30, 30), new Pattern('eye-right-sad.svg', 30, 30)];

const scowlMouth = new Pattern('mouth-scowl.svg', 40, 20);
const straightMouth = new Pattern('mouth-straight.svg', 40, 20);

const bulletEyeAnchors: Anchor[] = [
	[15, 30],
	[55, 30]
];
const bulletFace = new Pattern('face-bullet.svg', 100, 125)
	.addChoice(makeChoice(bulletEyeAnchors, [angryEyes, sadEyes]))
	.addChoice(makeChoice([[30, 70]], [[scowlMouth], [straightMouth]]));

const diamondEyeAnchors: Anchor[] = [
	[30, 35],
	[90, 35]
];
const diamondFace = new Pattern('face-diamond.svg', 150, 100)
	.addChoice(makeChoice(diamondEyeAnchors, [angryEyes, sadEyes]))
	.addChoice(makeChoice([[55, 70]], [[straightMouth], [scowlMouth]]));

export const rootPattern = new Pattern(null, 100, 100).addChoice(
	makeChoice([[0, 0]], [[bulletFace], [diamondFace]])
);
