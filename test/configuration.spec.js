import { configuration, getConfigurationValue } from "../src";

describe('getConfigurationValue', () => {

	configuration['foo.bar'] = true;

	test('should return exactly defined configuration value if only key was provided', () => {
		const value = getConfigurationValue('foo.bar');
		expect(value).toBe(true);
	});

	test('should return user value if it was provided', () => {
		const value = getConfigurationValue('foo.bar', false);
		expect(value).toBe(false);
	});

	test('should fallback to config value if user value was undefined', () => {
		const value = getConfigurationValue('foo.bar', undefined);
		expect(value).toBe(true);
	});

	test('should respect null', () => {
		const value = getConfigurationValue('foo.bar', null);
		expect(value).toBe(null);
	});

	test('should use `last chance` value if it was provided', () => {
		const value = getConfigurationValue('foo.bar', undefined, null);
		expect(value).toBe(null);
	});

});