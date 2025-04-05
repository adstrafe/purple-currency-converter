import type { Statistics } from '~/models/Statistics';
import type { Db } from 'mongodb';
import { MongoService } from './mongo/generic/MongoService';

export class StatisticsService extends MongoService<Statistics> {
	constructor(
		public readonly db: Db
	) {
		super(db, 'conversions')
	}
}