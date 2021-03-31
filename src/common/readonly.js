export function readonly(target, key, descriptor) {
	if (descriptor == null || typeof descriptor !== 'object') {
		throw new SyntaxError('Can only be applied to properties');
	}
	descriptor.writable = false;
}
