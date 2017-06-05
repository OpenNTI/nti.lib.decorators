const MIXINS = Symbol('Applied Mixins');

const { defineProperty, getOwnPropertyDescriptor,
		getOwnPropertyNames, getOwnPropertySymbols } = Object;

const getOwnProperties = getOwnPropertySymbols
		? (object) => [...getOwnPropertyNames(object), ...getOwnPropertySymbols(object)]
		: getOwnPropertyNames;

function inPrototype (o, key) {
	const proto = Object.getPrototypeOf(o || {});
	return proto && (proto.hasOwnProperty(key) || inPrototype(proto, key));
}

function getOwnPropertyDescriptors (obj) {
	const descs = {};

	for(let key of getOwnProperties(obj)) {
		descs[key] = getOwnPropertyDescriptor(obj, key);
	}

	return descs;
}


function getMixins (target) {
	const ownList = target.hasOwnProperty(MIXINS) ? target[MIXINS] : [];

	if (ownList.length === 0) {
		let seen = [];
		let proto = target;

		while (proto) {
			proto = Object.getPrototypeOf(proto);
			if (proto) {
				if (proto && proto.hasOwnProperty(MIXINS)) {
					seen.unshift(proto[MIXINS]);
				}
			}
		}
		seen = seen.reduce((a, b) => [...a, ...b.filter(x => !a.includes(x))], []);
		// console.log(target.name, seen.length, seen);
		ownList.push(...seen);
	}

	target[MIXINS] = ownList;
	return ownList;
}


function initMixins (...args) {
	const list = getMixins(this.constructor);
	for (let partial of list) {
		//Prefer 'initMixin' over constructor.
		const init = partial.initMixin || partial.constructor; //constructor fallback for legcy mixins
		if (init) {
			init.apply(this, args);
		}
	}
}


function handle (target, partials) {

	if (partials.length === 0) {
		throw new SyntaxError(`@mixin() class ${target.name} requires at least one mixin as an argument`);
	}

	if (inPrototype(target, 'initMixins')) {
		throw new TypeError(`@mixin(): class ${target.name} defines an initMixins property. This method must be defined by the @mixin() decorator.`);
	}

	target.prototype.initMixins = initMixins;

	const seen = getMixins(target);

	for (let partial of partials) {

		if (seen.includes(partial)) {
			throw new SyntaxError('@mixin() : Cannot mixin the same mixin more than once.');
		}

		seen.push(partial);

		const descs = getOwnPropertyDescriptors(partial);
		const props = getOwnProperties(descs);

		for (let key of props) {
			const desc = descs[key];

			if (key === 'initMixin') {
				continue;
			}

			if (target[key] == null || !inPrototype(target, key)) {
				defineProperty(target.prototype, key, desc);
			}
		}
	}

	return target;
}

export default function mixin (...partials) {

	if (typeof partials[0] === 'function') {
		const [target, property, desc] = partials;

		if (property || desc) {
			throw new SyntaxError('@mixin can only be applied to classes');
		}

		return handle(target, []);
	}

	return target => handle(target, partials);
}
