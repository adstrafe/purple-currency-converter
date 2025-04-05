import type { Context, Next } from 'koa';

import { ApplicationError } from '../ApplicationError';

export class ErrorHandler {
	public async use(context: Context, next: Next) {
		try {
			await next();
		}
		catch (ex) {
			const appError = ApplicationError.wrap(ex);
			context.status = appError.httpStatusCode;
			context.body = appError.toJSON();

			if (appError.httpStatusCode >= 500) {
				console.error(`internal error:\n${appError}`);
			}
			else {
				console.error(`request error:\n${appError}`);
			}
		}
	}
}