import { extend } from '../src/index.js';

describe("extend", () => {

	const MyClass = function() {
		this.value = 0;
	}
	Object.assign(MyClass.prototype, {
		setValue(n) {
			this.value = n;
			return this.value;
		}
	});
	MyClass.extend = extend;


	test("should define derived class with no option passed", () => {
		const Test = MyClass.extend();
		const test = new Test();
		expect(Test).not.toBe(MyClass);
		expect(Test.prototype).toBeInstanceOf(MyClass);
		expect(test).toBeInstanceOf(MyClass);
		expect(Test.prototype).not.toBe(MyClass.prototype);
		expect(test.setValue(5)).toBe(test.value);
	});

	test("should respect constructor for non ES6 class definitions", () => {
		const Test = MyClass.extend({
			constructor: function() {
				MyClass.apply(this, arguments);
				this.value = 'baz';
			}
		});
		const test = new Test();
		expect(test.value).toBe('baz');
	});	


	test("should support es6 classes deriving", () => {
		class Test extends MyClass {}
		const test = new Test();
		expect(Test).not.toBe(MyClass);
		expect(Test.prototype).toBeInstanceOf(MyClass);
		expect(test).toBeInstanceOf(MyClass);
		expect(Test.prototype).not.toBe(MyClass.prototype);
		expect(test.setValue(5)).toBe(test.value);
	});

	test("should be able to extend es6 classes", () => {
		class Test extends MyClass {}
		const SubTest = Test.extend({
			constructor: function() {
				this.foo = 'bar';
			}
		});
		const test = new SubTest();
		expect(SubTest).not.toBe(MyClass);
		expect(SubTest.prototype).toBeInstanceOf(MyClass);
		expect(SubTest.prototype).toBeInstanceOf(Test);
		expect(test).toBeInstanceOf(MyClass);
		expect(test).toBeInstanceOf(Test);
		expect(SubTest.prototype).not.toBe(Test.prototype);
		expect(test.setValue(5)).toBe(test.value);
		expect(test.foo).toBe('bar');
	});

	describe('extend arguments', () => {

		class ES6Class extends MyClass {};

		test('should be able to call parents prototye method through super', () => {
			
			const Test = ES6Class.extend({
				setValue(n) {
					this.super.setValue.apply(this, arguments);
					return n*10;
				}
			});
			const test = new Test();
			const value = test.setValue(5);
			expect(test.value).toBe(5);
			expect(value).toBe(50);
		});

		test('should accept prototype as first argument', () => {
			const Test = ES6Class.extend({
				constructor: function() {
					this.value = 10;
				},
				getValue() {
					return this.value;
				}
			});

			const test = new Test();
			expect(test.value).toBe(10);
			expect(test.getValue()).toBe(10);

		});

		test('should accept static extensions as second argument', () => {
			const Test = ES6Class.extend({
				constructor: function() {
					this.value = 10;
				},
				getValue() {
					return this.value;
				}
			}, {
				doCount(n) {
					return n*10;
				}
			});
			
			expect(Test.doCount(5)).toBe(50);
			
		});


	});




});