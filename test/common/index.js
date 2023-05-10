export function delay(ms = 0, callback) {
	if (typeof ms === 'function') {
		callback = ms;
		ms = 0;
	}
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (typeof callback === 'function') {
				callback();
			}
			res();
		}, ms);
	});
}