export const configuration = {
}

export function getConfigurationValue(key, userValue, lastChanceValue) {
	if (userValue !== undefined) {
		return userValue;
	}
	if (arguments.length === 3) {
		return lastChanceValue;
	}
	const configValue = configuration[key];
	return configValue;
}