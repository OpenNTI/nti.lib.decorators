import Logger from '@nti/util-logger';

const logger = Logger.get('decorators:Mixin');

const has = (x, k) => Object.prototype.hasOwnProperty.call(x, k);

//exported for testing
export const MIXINS = Symbol('Applied Mixins');

const {
	defineProperty,
	getOwnPropertyDescriptor,
	getOwnPropertyNames,
	getOwnPropertySymbols,
} = Object;

function ExpectedTypes(x) {
	const y = Object.getPrototypeOf(x);
	return y !== Object.prototype && y !== Function.prototype;
}

export const getOwnProperties = getOwnPropertySymbols
	? object => [
			...getOwnPropertyNames(object),
			...getOwnPropertySymbols(object),
	  ]
	: getOwnPropertyNames;

export function inPrototype(o, key) {
	const base = Object.getPrototypeOf(o || {});
	const proto = (o || {}).prototype;
	return Boolean(proto && (has(proto, key) || inPrototype(base, key)));
}

function getOwnPropertyDescriptors(obj) {
	const descs = {};

	for (let key of getOwnProperties(obj)) {
		descs[key] = getOwnPropertyDescriptor(obj, key);
	}

	return descs;
}

//exported for testing
export function getMixins(target) {
	const ownList = has(target, MIXINS) ? target[MIXINS] : [];

	if (ownList.length === 0) {
		let seen = [];
		let proto = target;

		while (proto) {
			proto = Object.getPrototypeOf(proto);
			if (proto) {
				if (proto && has(proto, MIXINS)) {
					seen.unshift(proto[MIXINS]);
				}
			}
		}
		seen = seen.reduce(
			(a, b) => (!b ? a : [...a, ...b.filter(x => !a.includes(x))]),
			[]
		);
		// console.log(target.name, seen.length, seen);
		ownList.push(...seen);
	}

	return ownList;
}

//exported for testing
export function initMixins(...args) {
	const list = getMixins(this.constructor);
	for (let partial of list) {
		//Prefer 'initMixin' over constructor.
		const init = partial.initMixin || partial.constructor; //constructor fallback for legacy mixins
		if (init) {
			init.apply(this, args);
		}
	}
}

export function handle(target, partials) {
	if (partials.length === 0) {
		throw new SyntaxError(
			`@mixin() class ${target.name} requires at least one mixin as an argument`
		);
	}

	if (partials.some(ExpectedTypes)) {
		throw new SyntaxError(
			`@mixin() class ${target.name} cannot mixin non-objects`
		);
	}

	if (
		inPrototype(target, 'initMixins') &&
		target.prototype.initMixins !== initMixins
	) {
		throw new TypeError(
			`@mixin(): class ${target.name} defines an initMixins property. This method must be defined by the @mixin() decorator.`
		);
	}

	if (
		target.prototype.initMixins &&
		target.prototype.initMixins !== initMixins
	) {
		throw new TypeError(
			`@mixin(): class ${target.name} cannot define a initMixins() method`
		);
	}

	if (target.prototype.initMixins !== initMixins) {
		target.prototype.initMixins = initMixins;
	}

	const seen = getMixins(target);
	const startLength = seen.length;

	for (let partial of partials) {
		if (seen.includes(partial)) {
			throw new SyntaxError(
				'@mixin() : Cannot mixin the same mixin more than once.'
			);
		}

		if (typeof partial === 'function') {
			partial = partial(target, target.prototype);
			if (!partial) {
				continue;
			}
		}

		seen.push(partial);

		const descs = getOwnPropertyDescriptors(partial);
		const props = getOwnProperties(descs);

		for (let key of props) {
			const desc = descs[key];

			if (key === 'initMixin' || key === 'constructor') {
				continue;
			}

			if (target.prototype[key] == null || !inPrototype(target, key)) {
				defineProperty(target.prototype, key, desc);
			} else {
				logger.debug(
					`${target.name} already defines %s, skipping...`,
					key
				);
			}
		}
	}

	if (seen.length > startLength) {
		target[MIXINS] = seen;
	}

	return target;
}

/**
 * @deprecated
 * @template T
 * @param  {...any} partials
 * @returns {(x:T) => T}
 */
export function mixin(...partials) {
	const [, property, desc] = partials;
	if (typeof property === 'string' && typeof desc === 'object') {
		throw new SyntaxError('@mixin can only be applied to classes');
	}

	return t => handle(t, partials);
}
