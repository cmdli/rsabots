export class Random {
	bits: number[] | null;
	index: number;
	constructor() {
		this.bits = null;
		this.index = 0;
	}

	async seed(dataString: string) {
		const data = new ArrayBuffer(dataString.length * 2);
		let view = new Uint16Array(data);
		for (let i = 0; i < dataString.length; i++) {
			view[i] = dataString.charCodeAt(i);
		}
		const digest = await crypto.subtle.digest('SHA-256', data);
		const digestView = new Uint8Array(digest);
		this.bits = [];
		for (let i = 0; i < digestView.length; i++) {
			const byte = digestView[i];
			for (let j = 0; j < 8; j++) {
				this.bits.push((byte >> j) & 0x1);
			}
		}
	}

	getBits(num: number): number {
		if (this.bits === null || this.bits.length < num) {
			throw 'Generator does not have enough bits. Have you seeded it?';
		}
		let bits = 0;
		for (let i = 0; i < num; i++) {
			bits = (bits << 1) | this.bits.pop();
		}
		return bits;
	}
}

const letters = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z'
];
function randomString(length: number) {
	let output = '';
	for (let i = 0; i < length; i++) {
		output = output + letters[Math.floor(Math.random() * letters.length)];
	}
	return output;
}

export async function testRandom() {
	const rng = new Random();
	let buckets = [];
	for (let i = 0; i < 16; i++) {
		buckets.push(0);
	}
	for (let round = 0; round < 1000; round++) {
		await rng.seed(randomString(16));
		for (let i = 0; i < 30; i++) {
			const num = rng.getBits(4);
			buckets[num]++;
		}
	}
	for (let i = 0; i < 16; i++) {
		console.log(i, ':', buckets[i]);
	}
}
