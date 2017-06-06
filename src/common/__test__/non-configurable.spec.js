import nonconfigurable from '../non-configurable';

describe('Configurable Decorator', () => {

	test('decorate function: throws on invalid args', () => {
		expect(() => nonconfigurable()).toThrow('Can only be applied to propertie');
		expect(() => nonconfigurable({})).toThrow('Can only be applied to propertie');
		expect(() => nonconfigurable({}, '')).toThrow('Can only be applied to propertie');
		expect(() => nonconfigurable({}, '', '')).toThrow('Can only be applied to propertie');
		expect(() => nonconfigurable({}, '', 1)).toThrow('Can only be applied to propertie');
		expect(() => nonconfigurable({}, '', null)).toThrow('Can only be applied to propertie');
		expect(() => nonconfigurable({}, '', {})).not.toThrow('Can only be applied to propertie');
	});

	test('Return value is void.', () => {
		expect(nonconfigurable({}, '', {})).toBeUndefined();
	});

	test('Returned decorate function: sets configurable', () => {
		const o = {};
		nonconfigurable({}, '', o);
		expect(o).toEqual({configurable: false});
	});

	/*
	test('Decoration', () => {

		const test = () => ({

			@nonconfigurable
			foo: 'bar'

		});


		expect(test).not.toThrow();

		const c = test();
		expect(c.foo).toBe('bar');
		expect(Object.getOwnPropertyDescriptor(c, 'foo').configurable).toBe(false);
	});
	*/
});
