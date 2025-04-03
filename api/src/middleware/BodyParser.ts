import { IncomingMessage } from 'node:http';

export class BodyParser {
	public parse(req: IncomingMessage) {
		let body = '';
		return new Promise((resolve, reject) => {
			req.on('data', chunk => {
				body += chunk.toString();
			});

			req.on('end', () => {
				try {
					resolve(JSON.parse(body));
				}
				catch (err) {
					reject(err);
				}
			});

			req.on('error', err => {
				reject(err);
			});
		});
	}
}