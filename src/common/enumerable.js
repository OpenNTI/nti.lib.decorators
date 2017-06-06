export default function enumerable (value) {
	if (typeof value !== 'boolean') {
		throw new SyntaxError('A boolean argument is required');
	}

	return (_, __, desc) => {
		if (desc == null || typeof desc !== 'object') {
			throw new SyntaxError('Can only be applied to properties');
		}
		desc.enumerable = Boolean(value);
	};
}
