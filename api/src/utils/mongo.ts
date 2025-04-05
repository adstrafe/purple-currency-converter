import { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { ApiErrorCode, ApplicationError } from '~/ApplicationError';

export function assertActionSuccess(result: DeleteResult | InsertOneResult | UpdateResult) {
	if (!result.acknowledged) {
		throw new ApplicationError({
			httpStatusCode: 500,
			publicMessage: 'Database action failed.'
		});
	};
};

export function assertSingleResult<T>(result: WithId<T> | null) {
	if (!result) {
		throw new ApplicationError({
			httpStatusCode: 404,
			apiErrorCode: ApiErrorCode.NOT_FOUND,
			publicMessage: 'Entity not found'
		});
	}
}