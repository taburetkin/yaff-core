import { isClass } from "../src";

describe('isClass', () => {

	class TestClass {}
	class DerivedTestClass extends TestClass {}

	test('should return false if argument is not a function', () => {
		const value = isClass(null, TestClass);
		expect(value).toBe(false);
	});

	test('should return false if argument is not derived class', () => {
		const value = isClass(function(){}, TestClass);
		expect(value).toBe(false);
	});

	test('should return true if argument is derived class', () => {
		const value = isClass(DerivedTestClass, TestClass);
		expect(value).toBe(true);
	});

	test('should return true if argument is exactly same class', () => {
		const value = isClass(TestClass, TestClass);
		expect(value).toBe(true);
	});

});