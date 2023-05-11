import { domApi } from "../src";
import { jest } from '@jest/globals';

describe('domApi', () => {

	let el;

	beforeEach(() => {
		el = domApi.createElement('div');
	});

	test('createElement', () => {
		const el = domApi.createElement('H1');
		expect(el).toBeInstanceOf(Element);
		expect(el.tagName).toBe('H1');
	});

	test('setAttributes accepts attributes hash', () => {

		domApi.setAttributes(el, { 'data-one': 1, 'data-two': 2});
		expect(el.hasAttribute('data-one')).toBe(true);
		expect(el.hasAttribute('data-two')).toBe(true);

		domApi.setAttributes(el, { 'data-one': null });
		expect(el.hasAttribute('data-one')).toBe(false);

	});

	test('setAttribute', () => {

		domApi.setAttribute(el, 'data-one', 1);
		expect(el.hasAttribute('data-one')).toBe(true);

		domApi.setAttribute(el, 'data-one', null);
		expect(el.hasAttribute('data-one')).toBe(false);
	});

	test('render', () => {
		const render = domApi.render.bind(domApi, el);
		expect(render).not.toThrow();
		const context = { text: 'boo - bar' };
		const tmplFunc = jest.fn((ctx) => ctx.text);
		domApi.render(el, tmplFunc, context);
		const mockValue = tmplFunc.mock.results[0].value;
		expect(mockValue).toBe(context.text);
		expect(el.innerHTML).toBe(context.text);
	});

	// test('events', () => {
	// 	expect(domApi.events.off).toThrow();
	// 	expect(domApi.events.on).toThrow();
	// });

	// test('buildTemplate', () => {
	// 	expect(domApi.buildTemplate).toThrow();
	// });

	test('findChildElement', () => {
		const span = document.createElement('span');
		el.append(span);
		span.append(document.createElement('span'));
		const found = domApi.findChildElement(el, '> span');
		expect(found).toBe(span);
		expect(domApi.findChildElement(el, null)).toBe(null);
	});

	test('detachElement', () => {
		const span = document.createElement('span');
		el.append(span);
		expect(span.parentNode).toBe(el);
		domApi.detachElement(span);
		expect(span.parentNode).toBe(null);
	});


	describe('attachElement', () => {

		let attachEl;
		beforeEach(() => {
			el.innerHTML = `<span class="base"></span>`;
			attachEl = document.createElement('p');
		});

		test('append', () => {
			domApi.attachElement(attachEl, el, 'append');
			expect(el.childNodes.length).toBe(2);
			expect(el.childNodes[1]).toBe(attachEl);
		});

		test('replaceContent', () => {
			domApi.attachElement(attachEl, el, 'replaceContent');
			expect(el.childNodes.length).toBe(1);
			expect(el.childNodes[0]).toBe(attachEl);
		});

		test('replace', () => {
			const replaceEl = domApi.findChildElement(el, 'span.base');
			const replacedEl = domApi.attachElement(attachEl, replaceEl, 'replace');
			expect(el.childNodes.length).toBe(1);
			expect(el.childNodes[0]).toBe(attachEl);
			expect(replacedEl).toBe(replaceEl);
		});

		test('prepend', () => {
			domApi.attachElement(attachEl, el, 'prepend');
			expect(el.childNodes.length).toBe(2);
			expect(el.childNodes[0]).toBe(attachEl);
		});

		test('before', () => {
			const childEl = domApi.findChildElement(el, 'span.base');
			domApi.attachElement(attachEl, childEl, 'before');
			expect(el.childNodes.length).toBe(2);
			expect(el.childNodes[0]).toBe(attachEl);
		});

		test('after', () => {
			const childEl = domApi.findChildElement(el, 'span.base');
			domApi.attachElement(attachEl, childEl, 'after');
			expect(el.childNodes.length).toBe(2);
			expect(el.childNodes[1]).toBe(attachEl);
		});

		test('default', () => {
			domApi.attachElement(attachEl, el);
			expect(el.childNodes.length).toBe(2);
			expect(el.childNodes[1]).toBe(attachEl);
		});

		test('should ignore attachIndex if attach is not before or after', () => {
			domApi.attachElement(attachEl, el, 'append', 0);
			expect(el.childNodes.length).toBe(2);
			expect(el.childNodes[1]).toBe(attachEl);

			attachEl = document.createElement('p');
			domApi.attachElement(attachEl, el, 'prepend', 1);
			expect(el.childNodes.length).toBe(3);
			expect(el.childNodes[0]).toBe(attachEl);

		});

		test('should respect attachIndex if attach is before or after', () => {
			domApi.attachElement(attachEl, el, 'after', 0);
			expect(el.childNodes.length).toBe(2);
			expect(el.childNodes[1]).toBe(attachEl);

			attachEl = document.createElement('p');
			domApi.attachElement(attachEl, el, 'before', 0);
			expect(el.childNodes.length).toBe(3);
			expect(el.childNodes[0]).toBe(attachEl);

			attachEl = document.createElement('p');
			domApi.attachElement(attachEl, el, 'before', 10);
			expect(el.childNodes.length).toBe(4);
			expect(el.childNodes[3]).toBe(attachEl);

		});

	});

});