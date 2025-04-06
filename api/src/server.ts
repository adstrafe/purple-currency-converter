import { loadConfig } from './config/loadConfig';
import { connectDatabase } from '../database/MongoClient';
import { ErrorHandler } from './middleware/ErrorHandler';
import { StatisticsService } from './services/StatisticsService';
import { FixerController } from './controllers/FixerController';
import { StatisticsController } from './controllers/StatisticsController';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import cors from '@koa/cors';

// init config, database connection, ...
const config = await loadConfig(process.argv[2]);
const db = await connectDatabase(config.database.uri, 'currency-converter');

const server = new Koa();
const errorHandler = new ErrorHandler();
const router = new Router();

// set up all the services, controllers and their dependencies
const statisticsService = new StatisticsService(db);

const fixerController = new FixerController(config, statisticsService);
const statisticsController = new StatisticsController(statisticsService)

// use middleware
server.use(bodyParser());
server.use(errorHandler.use.bind(errorHandler));
server.use(cors());

server.use(async (ctx, next) => {
	await next();
	console.log(`${ctx.method} ${ctx.url}`);
});

// register routes
router.post('/convert', async ctx => {
	const result = await fixerController.convert(ctx.request.body as any);
	ctx.status = 200;
	ctx.body = {
		result
	};
});

router.get('/statistics', async ctx => {
	const totalConversions = await statisticsController.getStatistics();
	ctx.status = 200;
	ctx.body = {
		totalConversions
	}
})

// use router
server
	.use(router.routes())
	.use(router.allowedMethods());

// start the server
server.listen(
	config.server.port,
	config.server.host
);

console.log(`server listening on ${config.server.host}:${config.server.port}`);