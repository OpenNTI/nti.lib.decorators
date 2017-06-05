export default function enumerable (value) {
	return (_, __, desc) => {
		desc.enumerable = Boolean(value);
	};
}
