import { isKnownCtor } from "./knownCtors.js";

export function invokeValue(value, context, args) {
	if (typeof value !== 'function' || isKnownCtor(value)) { return value; }

	if (arguments.length === 1) {
		return value();
	}

	if (args === undefined) {
		return value.call(context);
	}

	if (Array.isArray(args)) {
		return value.apply(context, args);
	}

	return value.call(context, args);
}