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
		console.log(digestView);
		console.log(this.bits);
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
