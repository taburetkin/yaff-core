import { invokeValue, knownCtors } from "../src";
import { jest } from '@jest/globals';

describe('invokeValue', () => {

	class TestClass {}
	class DerivedTestClass extends TestClass {}

	beforeEach(() => {
		knownCtors.push(TestClass);
	})

	afterEach(() => {
		knownCtors.length = 0;
	})

	test('should return value if its not a function', () => {
		expect(invokeValue(null)).toBe(null);
		expect(invokeValue(123)).toBe(123);
		const value = {};
		expect(invokeValue(value)).toBe(value);
	});

	test('should return value if it is a known ctor', () => {		
		expect(invokeValue(DerivedTestClass)).toBe(DerivedTestClass);
	});

	test('should invoke function and return its value', () => {
		expect(invokeValue(() => 'asd')).toBe('asd');
	});

	test('should invoke function with given context and return its value', () => {
		const context = {};
		const mockFn = jest.fn(() => 'asd');
		const value = invokeValue(mockFn, context);
		expect(value).toBe('asd');
		expect(mockFn.mock.contexts[0]).toBe(context);
	});

	test('should invoke function with given context and one argument and return its value', () => {
		const context = {};
		const mockFn = jest.fn(() => 'asd');
		const value = invokeValue(mockFn, context, context);
		expect(value).toBe('asd');
		expect(mockFn.mock.calls[0].length).toBe(1);
		expect(mockFn.mock.calls[0][0]).toBe(context);
	});

	test('should invoke function with given context and many arguments and return its value', () => {
		const context = {};
		const mockFn = jest.fn(() => 'asd');
		const value = invokeValue(mockFn, context, [context, null, 'foo']);
		expect(value).toBe('asd');
		expect(mockFn.mock.calls[0].length).toBe(3);
		expect(mockFn.mock.calls[0][0]).toBe(context);
		expect(mockFn.mock.calls[0][1]).toBe(null);
		expect(mockFn.mock.calls[0][2]).toBe('foo');
	});

});