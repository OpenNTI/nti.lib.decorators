export default function enumerable (value, ...args) {

	const decorate = (_, __, desc) => {
		if (desc == null || typeof desc !== 'object') {
			throw new SyntaxError('Can only be applied to properties');
		}
		desc.enumerable = Boolean(value);
	};

	if (typeof value !== 'boolean') {
		const [property, desc] = args;
		if (typeof property === 'string' && typeof desc === 'object') {
			value = true;
			return decorate(value, property, desc);
		}

		throw new SyntaxError('A boolean argument is required');
	}

	return decorate;
}
