import nonenumerable from '../non-enumerable';

describe('Configurable Decorator', () => {

	test('decorate function: throws on invalid args', () => {
		expect(() => nonenumerable()).toThrow('Can only be applied to propertie');
		expect(() => nonenumerable({})).toThrow('Can only be applied to propertie');
		expect(() => nonenumerable({}, '')).toThrow('Can only be applied to propertie');
		expect(() => nonenumerable({}, '', '')).toThrow('Can only be applied to propertie');
		expect(() => nonenumerable({}, '', 1)).toThrow('Can only be applied to propertie');
		expect(() => nonenumerable({}, '', null)).toThrow('Can only be applied to propertie');
		expect(() => nonenumerable({}, '', {})).not.toThrow('Can only be applied to propertie');
	});

	test('Return value is void.', () => {
		expect(nonenumerable({}, '', {})).toBeUndefined();
	});

	test('Returned decorate function: sets enumerable', () => {
		const o = {};
		nonenumerable({}, '', o);
		expect(o).toEqual({enumerable: false});
	});

	/*
	test('Decoration', () => {

		const test = () => ({

			@nonenumerable
			foo: 'bar'

		});


		expect(test).not.toThrow();

		const c = test();
		expect(c.foo).toBe('bar');
		expect(Object.getOwnPropertyDescriptor(c, 'foo').enumerable).toBe(false);
	});
	*/
});
