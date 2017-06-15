/* eslint-env jest */
import enumerable from '../enumerable';

describe('Enumerable Decorator', () => {

	test('No arguments throw.', () => {
		expect(enumerable).toThrow('A boolean argument is required');
	});

	test('Bad arguments throw.', () => {
		expect(() => enumerable('yes')).toThrow('A boolean argument is required');
	});

	test('With valid args, returns a function ', () => {
		expect(() => enumerable(true)).not.toThrow();
		expect(enumerable(true)).toEqual(expect.any(Function));
		expect(() => enumerable(false)).not.toThrow();
		expect(enumerable(false)).toEqual(expect.any(Function));

		const desc = {};
		expect(() => enumerable({}, 'test', desc)).not.toThrow();
		expect(desc.enumerable).toBe(true);

		delete desc.enumerable;
		expect(desc.enumerable).toBeUndefined();

		expect(enumerable({}, 'test', desc)).toBeUndefined();
		expect(desc.enumerable).toBe(true);
	});

	test('Returned decorate function: throws on invalid args', () => {
		const decorate = enumerable(false);
		expect(() => decorate()).toThrow('Can only be applied to propertie');
		expect(() => decorate({})).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '')).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', '')).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', 1)).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', null)).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', {})).not.toThrow('Can only be applied to propertie');
	});

	test('Returned decorate function: sets enumerable', () => {
		function test (b) {
			const o = {}, decorate = enumerable(b);
			decorate({}, '', o);
			expect(o).toEqual({enumerable: b});
		}

		test(true);
		test(false);
	});

	/*
	test('Decoration', () => {

		const test = () => ({

			@enumerable(false)
			foo: 'bar'

		});


		expect(test).not.toThrow();

		const c = test();
		expect(c.foo).toBe('bar');
		expect(Object.getOwnPropertyDescriptor(c, 'foo').enumerable).toBe(false);
	});
	*/
});
