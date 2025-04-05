import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { ApiErrorCode, ApplicationError } from '~/ApplicationError';

let client: MongoClient;
let db: Db;

export async function connectDatabase(uri: string, dbName: string) {
	// avoid multiple connections
	if (db) {
		return db;
	}

	try {
		client = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				deprecationErrors: true,
				strict: true
			}
		});

		await client.connect();
		db = client.db(dbName);

		console.log('Database successfully connected.');
		return db;
	}
	catch(err) {
		await client.close();
		throw new ApplicationError({
			apiErrorCode: ApiErrorCode.UNKNOWN,
			httpStatusCode: 500,
			publicMessage: 'Database connection failed'
		});
	}
}