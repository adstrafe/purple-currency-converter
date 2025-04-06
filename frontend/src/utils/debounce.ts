export const debounce = (callback: (...args: any) => void, delayMs: number) => {
	let timer: number;

	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			callback(...args);
		}, delayMs);
	};
}