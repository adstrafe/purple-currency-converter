import { readFile } from 'fs/promises';
import { resolve as resolvePath } from 'path';

import * as ss from 'superstruct';

import { ApplicationError } from '~/ApplicationError';

const MainConfig = ss.object({
	server: ss.object({
		host: ss.string(),
		port: ss.integer()
	}),
	api: ss.object({
		endpoint: ss.string(),
		key: ss.string()
	}),
	database: ss.object({
		uri: ss.string()
	})
});

export type ApplicationConfig = ss.Infer<typeof MainConfig>;

export async function loadConfig(filePath: string): Promise<ApplicationConfig> {
	try {
		const configPath = resolvePath(filePath);
		const json = await readFile(configPath, 'utf8');
		const config = JSON.parse(json);

		ss.assert(config, MainConfig);
		return config;
	}
	catch (ex) {
		throw ApplicationError.wrap(ex, {
			publicMessage: 'Failed to load JSON data.'
		});
	}
}
