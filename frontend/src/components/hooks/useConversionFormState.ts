import { useReducer } from 'preact/hooks';

interface ConversionFormState {
	readonly conversionCurrency: string | null;
	readonly loading: boolean;
	readonly result: number;
	readonly totalConversions: number;
}

const initialState: ConversionFormState = {
	conversionCurrency: null,
	loading: false,
	result: 0,
	totalConversions: 0
};

interface StartLoadingAction {
	readonly kind: 'start-loading';
}

interface SetResultAction {
	readonly kind: 'set-result';
	readonly result: number;
	readonly conversionCurrency: string;
}

interface SetConversionsAction {
	readonly kind: 'set-conversions';
	readonly totalConversions: number;
}

export type ConversionFormAction =
	| StartLoadingAction
	| SetResultAction
	| SetConversionsAction;

function reducer(state: ConversionFormState, action: ConversionFormAction) {
	switch (action.kind) {
		case 'start-loading':
			return {
				...state,
				loading: true
			};

		case 'set-result':
			return {
				...state,
				loading: false,
				result: action.result,
				conversionCurrency: action.conversionCurrency,
				totalConversions: state.totalConversions + 1
			};

		case 'set-conversions':
			return {
				...state,
				totalConversions: action.totalConversions
			};
	}
};

export const useConversionFormState = () => useReducer(reducer, initialState);
