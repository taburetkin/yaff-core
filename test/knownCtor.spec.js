import { isKnownCtor, knownCtors } from "../src/index.js";

describe('isKnownCtor', () => {

	class TestClass {}
	class DerivedTestClass extends TestClass {}

	beforeEach(() => {
		knownCtors.push(TestClass);
	})

	afterEach(() => {
		knownCtors.length = 0;
	})

	test('should return false if argument is not a function', () => {
		let value = isKnownCtor();
		expect(value).toBe(false);
		value = isKnownCtor(null);
		expect(value).toBe(false);
	});

	test('should return true if argument is a known ctor', () => {
		let value = isKnownCtor(DerivedTestClass);
		expect(value).toBe(true);
	});

	test('should return false if argument is not a known ctor', () => {
		let value = isKnownCtor(() => {});
		expect(value).toBe(false);
	});

});