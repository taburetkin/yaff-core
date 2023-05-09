import { uniqueId } from "../src/index.js";


describe('uniqueId', () => {

	test('should return integer greater than 0 if there is no prefix defined', () => {
		const value = uniqueId();
		const intValue = parseInt(value, 10);

		expect(value).toBeGreaterThan(0);
		expect(value).toBe(intValue);
		
	});

	test('should starts from given prefix', () => {
		const id = uniqueId('foo');
		expect(id).toMatch(/^foo\d+$/);
	});

});