export function takeFirst(key, ...objects) {
	if (key == null) {
		throw new Error('takeFirst expects key as first argument')
	}
	for(let obj of objects) {
		if (!obj) { continue; }
		const value = obj[key];
		if (value !== undefined) {
			return value;
		}
	}
}