import * as ss from 'superstruct';

import { ApiErrorCode, ApplicationError } from '~/ApplicationError';

export function assertModel<T, S>(data: unknown, struct: ss.Struct<T, S>): asserts data is T {
	const result = ss.validate(data, struct);
	if (result[0] !== undefined) {
		throw new ApplicationError({
			innerError: result[0],
			apiErrorCode: ApiErrorCode.MODEL_INVALID,
			httpStatusCode: 400, // bad request
			publicMessage: 'Invalid data'
		});
	}
};

export function assertPartialModel<T, S>(data: unknown, struct: ss.Struct<T, S>): asserts data is Partial<T> {
	assertModel(data, ss.partial({ struct }));
};