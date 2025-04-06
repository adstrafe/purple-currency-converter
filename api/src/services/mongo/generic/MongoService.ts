import type { Collection, Db, DeleteResult, Document, Filter, InsertOneResult, OptionalUnlessRequiredId, UpdateFilter, UpdateResult, WithId } from 'mongodb';
import { assertActionSuccess, assertSingleResult } from '~/utils/mongo';

export interface BaseMongoService<T extends Document> {
	create(id: string, data: OptionalUnlessRequiredId<T>): Promise<InsertOneResult<T>>;
	getSingle(filter: Filter<T>): Promise<WithId<T> | null>;
	getAll(): Promise<WithId<T>[]>;
	update(filter: Filter<T>, data: UpdateFilter<T>): Promise<UpdateResult<T>>;
	delete(filter: Filter<T>): Promise<DeleteResult>;
}

export abstract class MongoService<T extends Document> implements BaseMongoService<T> {
	private collection: Collection<T>;

	public constructor(
		public readonly db: Db,
		public collectionName: string
	) {
		this.collection = this.db.collection(collectionName);
	}

	public async create(id: string, data: OptionalUnlessRequiredId<T>) {
		const result = await this.collection.insertOne({
			_id: id,
			...data
		});
	
		assertActionSuccess(result);
		return result;
	}

	public async getSingle(filter: Filter<T>) {
		const result = await this.collection.findOne(filter);
		assertSingleResult(result);

		return result as WithId<T>;
	}

	public getAll() {
		return this.collection
			.find({})
			.toArray();
	}

	public async update(filter: Filter<T>, data: UpdateFilter<T>) {
		const result = await this.collection.updateOne(filter, data);
		assertActionSuccess(result);

		return result;
	}

	public async delete(filter: Filter<T>): Promise<DeleteResult> {
		const result = await this.collection.deleteOne(filter);
		assertActionSuccess(result);

		return result;
	}
}