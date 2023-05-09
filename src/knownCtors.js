export const knownCtors = [];

export function isKnownCtor(arg) {
	if (typeof arg !== 'function') { return false; }
	for (let Ctor of knownCtors) {
		if (arg === Ctor || arg.prototype instanceof Ctor) {
			return true;
		}
	}
	return false;
}