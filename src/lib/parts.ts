function zip<A, B>(array1: A[], array2: B[]): [A, B][] {
	const result: [A, B][] = [];
	for (let i = 0; i < array1.length; i++) {
		result.push([array1[i], array2[i]]);
	}
	return result;
}

class Part {
	imagePath: string | null;
	anchors: [Anchor, Part][];
	constructor(imagePath: string | null) {
		this.anchors = [];
		this.imagePath = imagePath;
	}

	addAnchor(x: number, y: number, part: Part) {
		this.anchors.push([[x, y], part]);
		return this;
	}
}

type Anchor = [number, number];
type ChoiceResult = [Anchor, Pattern][];
type ChoiceSelection = ChoiceResult[];

function randomChoice(selection: ChoiceSelection): ChoiceResult {
	// TODO: Randomly choose
	return selection[0];
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
	choices: ChoiceSelection[];

	constructor(background: string | null) {
		this.background = background;
		this.choices = [];
	}

	addChoice(selection: ChoiceSelection): Pattern {
		this.choices.push(selection);
		return this;
	}

	resolve(): Part {
		const result = new Part(this.background);
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

const angryEyes = [new Pattern('eye-left-angry.svg'), new Pattern('eye-right-angry.svg')];
const sadEyes = [new Pattern('eye-left-sad.svg'), new Pattern('eye-right-sad.svg')];

const scowlMouth = new Pattern('mouth-scowl.svg');
const straightMouth = new Pattern('mouth-straight.svg');

const bulletEyeAnchors: Anchor[] = [
	[17, 30],
	[53, 30]
];
const bulletFace = new Pattern('face-bullet.svg')
	.addChoice(makeChoice(bulletEyeAnchors, [angryEyes, sadEyes]))
	.addChoice(makeChoice([[35, 60]], [[scowlMouth], [straightMouth]]));

const diamondEyeAnchors: Anchor[] = [
	[17, 50],
	[53, 50]
];
const diamondFace = new Pattern('face-diamond.svg')
	.addChoice(makeChoice(diamondEyeAnchors, [angryEyes, sadEyes]))
	.addChoice(makeChoice([[35, 70]], [[straightMouth], [scowlMouth]]));

export const rootPattern = new Pattern(null).addChoice(
	makeChoice([[0, 0]], [[bulletFace], [diamondFace]])
);
