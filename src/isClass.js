export function isClass(arg, Ctor) {
	return typeof arg === 'function' && (arg === Ctor || arg.prototype instanceof Ctor);
}