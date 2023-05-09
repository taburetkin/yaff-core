import { takeFirst } from '../src/index.js';

describe('takeFirst', () => {

	test('should throw if no key pprovided', () => {
		expect(takeFirst).toThrow();
	});

	test('should return undefined when given set of object is empty', () => {
		const value = takeFirst('foo');
		expect(value).toBe(undefined);
	});

	test("should not throw when given array contains not objects", () => {
		const value = takeFirst('foo', {}, undefined, {foo: undefined }, [], null, { foo: 'bar'});
		expect(value).toBe('bar');
	});

	test("should return first defined value for set of objects by given key", () => {
		const value = takeFirst('foo', {}, undefined, {foo: undefined }, [], null, { foo: 'bar'});
		expect(value).toBe('bar');
	});

	test("should respect null as a value", () => {
		const value = takeFirst('foo', {}, undefined, {foo: null }, [], null, { foo: 'bar'});
		expect(value).toBe(null);
	});

});