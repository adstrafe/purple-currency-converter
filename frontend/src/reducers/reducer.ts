interface ApplicationState {
	readonly conversionCurrency: string;
	readonly error: string;
	readonly loading: boolean;
	readonly result: number;
	readonly totalConversions: number;
}

export const initState: ApplicationState = {
	conversionCurrency: null,
	error: null,
	loading: false,
	result: 0,
	totalConversions: 0
};

interface Action {
	readonly type: REDUCER_ACTION_TYPE;
	readonly payload?: Payload;
}

interface Payload {
	readonly result?: number;
	readonly error?: string;
	readonly totalConversions?: number;
	readonly conversionCurrency?: string;
}

export enum REDUCER_ACTION_TYPE {
	START_LOADING,
	SET_RESULT,
	SET_ERROR,
	SET_CONVERSIONS
}

export const reducer = (state: ApplicationState, action: Action) => {
	switch (action.type) {
		case REDUCER_ACTION_TYPE.START_LOADING:
			return {
				...state, loading: true
			}
		case REDUCER_ACTION_TYPE.SET_CONVERSIONS:
			return {
				...state,
				totalConversions: action.payload.totalConversions
			}
		case REDUCER_ACTION_TYPE.SET_ERROR:
			return {
				...state,
				loading: false,
				error: action.payload.error
			}
		case REDUCER_ACTION_TYPE.SET_RESULT:
			return {
				...state,
				loading: false,
				result: action.payload.result,
				conversionCurrency: action.payload.conversionCurrency,
				totalConversions: action.payload.totalConversions + 1
			}
		default:
			throw new Error(`Unknown reducer action: ${action.type}`);
	}
};