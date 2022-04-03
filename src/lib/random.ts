import seedrandom from 'seedrandom';

const salt = Uint8Array.of(231, 126, 79, 196, 212, 85, 119, 77, 234, 240, 46, 38, 23, 19, 169, 193);

export class Random {
	bits: number[] | null;
	index: number;
	private rng;
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
		const enc = new TextEncoder();
		const key = await crypto.subtle.importKey(
			'raw',
			enc.encode(dataString),
			{ name: 'PBKDF2' },
			false,
			['deriveBits', 'deriveKey']
		);
		const randomBits = await crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				iterations: 100000,
				salt: salt,
				hash: 'SHA-256'
			},
			key,
			256
		);
		const base64String = window.btoa(String.fromCharCode(...new Uint8Array(randomBits)));
		this.rng = seedrandom(base64String);
	}

	random(): number {
		return this.rng();
	}
}
