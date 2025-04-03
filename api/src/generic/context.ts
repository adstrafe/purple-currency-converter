import { IncomingMessage, ServerResponse } from 'http';
import { BodyParser } from '~/middleware/BodyParser';

export interface Context {
	req: IncomingMessage;
	res: ServerResponse;
	bodyParser: BodyParser
}