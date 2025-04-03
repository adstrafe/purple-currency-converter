import { Context } from '~/generic/context';
import { Route } from '~/generic/route';

export const test: Route = ({ req, bodyParser }: Context) => {
	const body = bodyParser.parse(req);
	
	return {

	};
};