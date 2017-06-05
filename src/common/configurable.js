export default function configurable (value) {
	return (_, __, desc) => {
		desc.configurable = Boolean(value);
	};
}
