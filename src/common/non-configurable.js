export function nonconfigurable(target, key, descriptor) {
	if (descriptor == null || typeof descriptor !== 'object') {
		throw new SyntaxError('Can only be applied to properties');
	}
	descriptor.configurable = false;
}
