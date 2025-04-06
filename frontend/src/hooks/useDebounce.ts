import { useCallback, useEffect, useRef } from 'preact/hooks';

export interface AnyCallback {
	(...args: any): void;
}

export function useDebounce<TArgs extends any[]>(callback: (...args: TArgs) => void, delayMs: number) {
	const timerRef = useRef<ReturnType<typeof setTimeout>>();

	// clear potential leftover timer on unmount
	useEffect(() => () => clearTimeout(timerRef.current), []);

	return useCallback((...args: TArgs) => {
		if (timerRef.current !== undefined) {
			return;
		}

		try {
			callback(...args);
		}
		finally {
			timerRef.current = setTimeout(() => {
				timerRef.current = undefined;
			}, delayMs);
		}
	}, [ delayMs ]);
};
