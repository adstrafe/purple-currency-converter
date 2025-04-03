import { createServer } from 'node:http';

import { ApiErrorCode, ApplicationError } from './ApplicationError';
import { loadConfig } from './config/loadConfig';
import { Route } from './generic/route';
import { BodyParser } from './middleware/BodyParser';

import { test } from '~/endpoints/test';

const config = await loadConfig(process.argv[3]);
const bodyParser = new BodyParser();

const ROUTES: { [key: string]: Route } = {
	'/test': test
};

const server = createServer(async (req, res) => {
	let result;
	const reqTimeStart = Date.now();
	try {
		const route = ROUTES[req.url!];
		if (!route) {
			throw new ApplicationError({
				apiErrorCode: ApiErrorCode.NOT_FOUND,
				httpStatusCode: 404,
				publicMessage: 'Unknown endpoint'
			});
		}

		result = await route({
			req,
			res,
			bodyParser
		});
	}
	catch (err: any) {
		res.statusCode = err.httpStatusCode ?? 500;
		result = {
			message: err.publicMessage ?? 'Unknown server error'
		}
	}
	const reqTimeEnd = Date.now();
	console.log(`${new Date().toISOString()} - ${req.url} - ${res.statusCode} - ms: ${reqTimeEnd - reqTimeStart}`);

	res.setHeader('Content-Type', 'Application/Json; charset=utf-8');
	res.end(JSON.stringify(result));
});

server.listen(
	config.server.port,
	config.server.host
);

console.log(`server listening on ${config.server.host}:${config.server.port}`);