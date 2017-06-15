/* eslint-env jest */
import configurable from '../configurable';

describe('Configurable Decorator', () => {

	test('No arguments throw.', () => {
		expect(configurable).toThrow('A boolean argument is required');
	});

	test('Bad arguments throw.', () => {
		expect(() => configurable('yes')).toThrow('A boolean argument is required');
	});

	test('With valid args, returns a function ', () => {
		expect(() => configurable(true)).not.toThrow();
		expect(configurable(true)).toEqual(expect.any(Function));
		expect(() => configurable(false)).not.toThrow();
		expect(configurable(false)).toEqual(expect.any(Function));

		const desc = {};
		expect(() => configurable({}, 'test', desc)).not.toThrow();
		expect(desc.configurable).toBe(true);

		delete desc.configurable;
		expect(desc.configurable).toBeUndefined();

		expect(configurable({}, 'test', desc)).toBeUndefined();
		expect(desc.configurable).toBe(true);
	});

	test('Returned decorate function: throws on invalid args', () => {
		const decorate = configurable(false);
		expect(() => decorate()).toThrow('Can only be applied to propertie');
		expect(() => decorate({})).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '')).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', '')).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', 1)).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', null)).toThrow('Can only be applied to propertie');
		expect(() => decorate({}, '', {})).not.toThrow('Can only be applied to propertie');
	});

	test('Returned decorate function: sets configurable', () => {
		function test (b) {
			const o = {}, decorate = configurable(b);
			decorate({}, '', o);
			expect(o).toEqual({configurable: b});
		}

		test(true);
		test(false);
	});

	/*
	test('Decoration', () => {

		const test = () => ({

			@configurable(false)
			foo: 'bar'

		});


		expect(test).not.toThrow();

		const c = test();
		expect(c.foo).toBe('bar');
		expect(Object.getOwnPropertyDescriptor(c, 'foo').configurable).toBe(false);
	});
	*/
});
