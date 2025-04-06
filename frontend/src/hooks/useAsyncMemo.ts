import { useEffect, useReducer, type Inputs } from 'preact/hooks';

interface UseAsyncMemoPending {
	readonly status: 'pending';
	readonly isPending: true;
	readonly isFulfilled: false;
	readonly isRejected: false;
}

interface UseAsyncMemoRejected {
	readonly status: 'rejected';
	readonly isPending: false;
	readonly isFulfilled: false;
	readonly isRejected: true;
	readonly reason: unknown;
}

interface UseAsyncMemoFulfilled<T> {
	readonly status: 'fulfilled';
	readonly isPending: false;
	readonly isFulfilled: true;
	readonly isRejected: false;
	readonly result: T;
}

export type UseAsyncMemoResult<T> =
	| UseAsyncMemoPending
	| UseAsyncMemoRejected
	| UseAsyncMemoFulfilled<T>;


type HookState<T> = UseAsyncMemoResult<T>;

interface StartAction {
	readonly kind: 'start';
}

interface ResolveAction<T> {
	readonly kind: 'resolve';
	readonly result: T;
}

interface RejectAction {
	readonly kind: 'reject';
	readonly reason: unknown;
}

type HookAction<T> =
	| StartAction
	| ResolveAction<T>
	| RejectAction;

const initialState: HookState<never> = {
	status: 'pending',
	isPending: true,
	isFulfilled: false,
	isRejected: false
};

function stateReducer<T>(state: HookState<T>, action: HookAction<T>): HookState<T> {
	switch (action.kind) {
		case 'start':
			return initialState;

		case 'resolve':
			return {
				status: 'fulfilled',
				isPending: false,
				isFulfilled: true,
				isRejected: false,
				result: action.result
			};

		case 'reject':
			return {
				status: 'rejected',
				isPending: false,
				isFulfilled: false,
				isRejected: true,
				reason: action.reason
			};
	}
}

export function useAsyncMemo<T>(
	factory: (signal: AbortSignal) => Promise<T>,
	deps: Inputs
): UseAsyncMemoResult<T> {
	const [ state, dispatch ] = useReducer<HookState<T>, HookAction<T>>(stateReducer, initialState);

	useEffect(() => {
		const controller = new AbortController();
		const pending = factory(controller.signal);
		dispatch({ kind: 'start' });

		pending.then(
			result => {
				if (controller.signal.aborted) {
					return;
				}

				dispatch({
					kind: 'resolve',
					result
				});
			},
			reason => {
				if (controller.signal.aborted) {
					return;
				}

				dispatch({
					kind: 'reject',
					reason
				});
			}
		);

		return () => {
			controller.abort();
		};
	}, deps);

	return state;
}
