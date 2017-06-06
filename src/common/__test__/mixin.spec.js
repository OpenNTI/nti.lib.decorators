import Logger from 'nti-util-logger';

const logger = Logger.get('decorators:Mixin');

import mixin, {MIXINS, getMixins, inPrototype, initMixins, handle, getOwnProperties} from '../mixin';

describe('Mixin Decorator', () => {
	test('getMixins(): Returns an array of mixed in values, traversing the prototype chain', () => {
		class foo {
			static [MIXINS] = ['1', '2']
		}
		class bar extends foo {
			static [MIXINS] = ['3', '4', '5']
		}
		class baz extends bar {}

		expect(getMixins(baz)).toEqual(['1','2','3','4','5']);
		//getMixins does not ADD the MIXINS property
		expect(baz.hasOwnProperty(MIXINS)).toBe(false);
	});

	test('getMixins() does not add MIXINS to class', () => {
		class foo {}
		expect(getMixins(foo)).toEqual([]);
		expect(foo[MIXINS]).toBeUndefined();
		expect(foo.hasOwnProperty(MIXINS)).toBe(false);
	});

	test('initMixins() calls the initMixin/constructor method on mixins', () => {
		const mixinA = {initMixin: jest.fn()};
		const mixinB = {initMixin: jest.fn(), constructor: jest.fn()};
		const mixinC = {constructor: jest.fn()};

		class baz {
			static [MIXINS] = [mixinA, mixinB, mixinC]
		}

		class bar extends baz {}

		class foo extends bar {
			constructor () {
				super();
				this.initMixins = jest.fn(initMixins);
				this.initMixins(123);
			}
		}


		const meh = new foo();

		expect(meh).toBeTruthy();
		expect(meh.initMixins).toHaveBeenCalledWith(123);

		expect(mixinA.initMixin).toHaveBeenCalledWith(123);
		expect(mixinB.initMixin).toHaveBeenCalledWith(123);
		expect(mixinB.constructor).not.toHaveBeenCalledWith(123);
		expect(mixinC.constructor).toHaveBeenCalledWith(123);
	});

	test('inPrototype()', () => {
		class Foo {
			test () {}
		}

		class Bar extends Foo {}

		expect(inPrototype(Foo, 'test')).toBe(true);
		expect(inPrototype(Foo, 'test2')).toBe(false);
		expect(inPrototype(Bar, 'test')).toBe(true);
		expect(inPrototype(Bar, 'test2')).toBe(false);
	});

	test('handle() applies partials to {target.prototype}', () => {
		const partial = {myTestFn () {}, [Symbol()]: 'foo', bar: 'baz'};
		class Foo {}

		for (let key of getOwnProperties(partial)) {
			expect(Foo.prototype[key]).not.toBe(partial[key]);
		}

		expect(() => handle(Foo, [partial])).not.toThrow();

		for (let key of getOwnProperties(partial)) {
			expect(Foo.prototype[key]).toBe(partial[key]);
		}

		//Validate we do not polute the wrong prototypes...

		class Bar {}
		function meh () {}

		for (let key of getOwnProperties(partial)) {
			expect(Bar[key]).toBeUndefined();
			expect(Bar.prototype[key]).toBeUndefined();
			expect(meh[key]).toBeUndefined();
			expect(meh.prototype[key]).toBeUndefined();
		}
	});

	test('handle() skips & warns conflicting keys...', () => {
		const partial = {test: () => 'mixin'};
		class Foo {
			test () {
				return 'class version';
			}
		}

		jest.spyOn(logger, 'debug').mockImplementation(() => {});

		expect(() => handle(Foo, [partial])).not.toThrow();

		expect(Foo.prototype.test).not.toBe(partial.test);

		expect(logger.debug).toHaveBeenCalledWith('Foo already defines %s, skipping...', 'test');
	});

	test('handle() adds initMixins() to {target.prototype}', () => {
		const partial = {test: () => 'mixin'};
		const partial2 = {test2: () => 'mixin'};

		class Foo {}
		expect(() => handle(Foo, [partial])).not.toThrow();

		class Bar extends Foo {}
		expect(() => handle(Bar, [partial2])).not.toThrow();

		expect(Foo.prototype.initMixins).toBe(initMixins);
		expect(Bar.prototype.initMixins).toBe(initMixins);
	});

	test('handle() throws if initMixins() is already defined on {target.prototype}', () => {
		const partial = {test: () => 'mixin'};
		class Foo {
			initMixins () {}
		}

		expect(() => handle(Foo, [partial])).toThrow('@mixin(): class Foo defines an initMixins property. This method must be defined by the @mixin() decorator.');
	});

	test('mixin() throws errors for invalid invocations', () => {
		expect(() => mixin()).toThrow('@mixin can only be applied to classes');
		expect(() => mixin(class Foo {}, '', {})).toThrow('@mixin can only be applied to classes');
		expect(() => mixin(class Foo {})).toThrow('@mixin() class Foo requires at least one mixin as an argument');

		const decorate = mixin({}, new Date(), '123', 123);
		expect(decorate).toEqual(expect.any(Function));
		expect(() => decorate(class Foo {})).toThrow('@mixin() class Foo cannot mixin non-objects');
	});

	test('mixin() normal workflow', () => {
		const mixA = {};
		const mixB = {abc: '123'};
		class Foo {}
		let decorate = null;
		expect(() => decorate = mixin(mixA, mixB)).not.toThrow();
		expect(decorate).toEqual(expect.any(Function));
		expect(() => decorate(Foo)).not.toThrow();
		expect(Foo.prototype.initMixins).toBe(initMixins);
		expect(Foo.prototype.abc).toBe('123');
		expect(Foo[MIXINS]).toEqual([mixA, mixB]);
	});
});
