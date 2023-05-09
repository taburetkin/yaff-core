let id = 0;

export function uniqueId(prefix) {
	id++;
	if (prefix) {
		return prefix + id;
	}
	return id;
}