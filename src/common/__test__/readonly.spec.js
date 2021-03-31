/* eslint-env jest */
import { readonly } from '../readonly.js';

describe('Configurable Decorator', () => {
	test('decorate function: throws on invalid args', () => {
		expect(() => readonly()).toThrow('Can only be applied to propertie');
		expect(() => readonly({})).toThrow('Can only be applied to propertie');
		expect(() => readonly({}, '')).toThrow(
			'Can only be applied to propertie'
		);
		expect(() => readonly({}, '', '')).toThrow(
			'Can only be applied to propertie'
		);
		expect(() => readonly({}, '', 1)).toThrow(
			'Can only be applied to propertie'
		);
		expect(() => readonly({}, '', null)).toThrow(
			'Can only be applied to propertie'
		);
		expect(() => readonly({}, '', {})).not.toThrow(
			'Can only be applied to propertie'
		);
	});

	test('Return value is void.', () => {
		expect(readonly({}, '', {})).toBeUndefined();
	});

	test('Returned decorate function: sets writable', () => {
		const o = {};
		readonly({}, '', o);
		expect(o).toEqual({ writable: false });
	});

	/*
	test('Decoration', () => {

		const test = () => ({

			@readonly
			foo: 'bar'

		});


		expect(test).not.toThrow();

		const c = test();
		expect(c.foo).toBe('bar');
		expect(Object.getOwnPropertyDescriptor(c, 'foo').writable).toBe(false);
	});
	*/
});
