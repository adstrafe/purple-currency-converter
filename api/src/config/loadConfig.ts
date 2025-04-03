import { readFile } from 'fs/promises';
import { resolve as resolvePath } from 'path';

import * as ss from 'superstruct';

import { ApplicationError } from '~/ApplicationError';

// const SqlServerConfig = ss.object({
// 	server: ss.string(),
// 	port: ss.optional(ss.integer()),
// 	user: ss.string(),
// 	password: ss.string(),
// 	database: ss.string(),
// 	options: ss.optional(ss.object({
// 		encrypt: ss.optional(ss.boolean()),
// 		trustServerCertificate: ss.optional(ss.boolean())
// 	}))
// });

const MainConfig = ss.object({
	// userDatabase: SqlServerConfig,
	server: ss.object({
		host: ss.string(),
		port: ss.integer()
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
