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
