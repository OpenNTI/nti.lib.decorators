export default function nonconfigurable (target, key, descriptor) {
	descriptor.configurable = false;
}
