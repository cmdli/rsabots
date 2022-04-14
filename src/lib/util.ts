export function makeStyle(attributes: object): string {
	let style = '';
	for (const key in attributes) {
		style = key + ':' + attributes[key] + ';' + style;
	}
	return style;
}

export function zip<A, B>(array1: A[], array2: B[]): [A, B][] {
	const result: [A, B][] = [];
	for (let i = 0; i < array1.length; i++) {
		result.push([array1[i], array2[i]]);
	}
	return result;
}

export function makeClass(classList: string, classes: object): string {
	for (const className in classes) {
		if (classes[className]) {
			classList = classList + ' ' + className;
		}
	}
	return classList;
}
export function shuffle<A>(arr: A[]) {
	for (let i = 0; i < arr.length; i++) {
		let j = Math.floor(Math.random() * (arr.length - i)) + i;
		let tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randomString(length: number = 12): string {
	let str = '';
	for (let i = 0; i < length; i++) {
		str += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
	}
	return str;
}

export async function randomKey(): Promise<string> {
	const key = await crypto.subtle.generateKey(
		{
			name: 'ECDSA',
			namedCurve: 'P-256'
		},
		true,
		['sign']
	);
	const keyBytes = await crypto.subtle.exportKey('spki', key.publicKey);
	return (
		'-----BEGIN PUBLIC KEY-----\n' +
		window.btoa(String.fromCharCode.apply(null, new Uint8Array(keyBytes))) +
		'\n-----END PUBLIC KEY-----'
	);
}
