import { Kysely, sql } from 'kysely';
import type { ColumnType, Generated, QueryCreator } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { D1Database } from '@cloudflare/workers-types';
import { DatabaseError, GenericError } from './model';
import type {
	Language,
	NewLanguage,
	SetLanguage,
	ParLanguage,
	Website,
	NewWebsite,
	SetWebsite,
	ParWebsite,
	CategoryType,
	NewCategoryType,
	SetCategoryType,
	ParCategoryType,
	Category,
	NewCategory,
	ParCategory,
	SetCategory,
	CategorySID,
	CategoryRelation,
	NewCategoryRelation,
	SetCategoryRelation,
	ParCategoryRelation,
	CategoryRelationSID,
	TagType,
	NewTagType,
	SetTagType,
	ParTagType,
	Tag,
	NewTag,
	SetTag,
	ParTag,
	TagSID,
	Comic,
	NewComic,
	SetComic,
	ParComic,
	ComicGenericSID,
	ComicTitle,
	NewComicTitle,
	SetComicTitle,
	ParComicTitle,
	ComicCover,
	NewComicCover,
	ParComicCover,
	SetComicCover,
	ComicSynopsis,
	NewComicSynopsis,
	ParComicSynopsis,
	SetComicSynopsis,
	ComicExternal,
	NewComicExternal,
	ParComicExternal,
	SetComicExternal,
	ComicCategory,
	NewComicCategory,
	SetComicCategory,
	ParComicCategory,
	ComicCategorySID,
	ComicTag,
	NewComicTag,
	ParComicTag,
	SetComicTag,
	ComicTagSID,
	ComicRelationType,
	NewComicRelationType,
	SetComicRelationType,
	ParComicRelationType,
	ComicRelation,
	NewComicRelation,
	SetComicRelation,
	ParComicRelation,
	ComicRelationSID,
	ComicChapter,
	NewComicChapter,
	SetComicChapter,
	ParComicChapter,
	ComicChapterSID
} from './model';

const CODE_ERROR_FOREIGN = '23503';
const CODE_ERROR_EXISTS = '23505';
const CODE_ERROR_VALIDATION = '23514';

interface Database {
	'donoengine.language': LanguageTable;
	'donoengine.website': WebsiteTable;
	'donoengine.category_type': CategoryTypeTable;
	'donoengine.category': CategoryTable;
	'donoengine.category_relation': CategoryRelationTable;
	'donoengine.tag_type': TagTypeTable;
	'donoengine.tag': TagTable;
	'donoengine.comic': ComicTable;
	'donoengine.comic_title': ComicTitleTable;
	'donoengine.comic_cover': ComicCoverTable;
	'donoengine.comic_synopsis': ComicSynopsisTable;
	'donoengine.comic_external': ComicExternalTable;
	'donoengine.comic_category': ComicCategoryTable;
	'donoengine.comic_tag': ComicTagTable;
	'donoengine.comic_relation_type': ComicRelationTypeTable;
	'donoengine.comic_relation': ComicRelationTable;
	'donoengine.comic_chapter': ComicChapterTable;
}

export const database = (db: D1Database) => {
	return new Kysely<Database>({
		dialect: new D1Dialect({ database: db })
	});
};
export type DB = Kysely<Database>;

function databaseCatch(e: unknown): void {
	/* if (e instanceof pg.DatabaseError) {
		if (e.code == CODE_ERROR_VALIDATION) {
			throw new GenericError('database validation failed');
		}

		throw new DatabaseError(e.message, e.code, e.constraint);
	} */
}

interface LanguageTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	ietf: string;
	name: string;
}

const NAME_ERROR_LANGUAGE_KEY = 'language_ietf_key';

export async function insertLanguage(db: DB, v: NewLanguage): Promise<Language> {
	try {
		const r = await db
			.insertInto('donoengine.language')
			.values({
				ietf: v.ietf,
				name: v.name
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			ietf: r.ietf,
			name: r.name
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_LANGUAGE_KEY) {
				throw new GenericError('same ietf already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectLanguage(
	db: Kysely<Database>,
	criteria: ParLanguage
): Promise<Language[]> {
	try {
		let query = db.selectFrom('donoengine.language');

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'ietf':
					case 'name':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.selectAll().execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				ietf: r.ietf,
				name: r.name
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectLanguageByIETF(db: DB, ietf: string): Promise<Language | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.language')
			.where('ietf', '=', ietf)
			.selectAll()
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				ietf: r.ietf,
				name: r.name
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateLanguageByIETF(
	db: DB,
	ietf: string,
	v: SetLanguage
): Promise<Language | undefined> {
	try {
		let query = db
			.updateTable('donoengine.language')
			.set({
				ietf: v.ietf,
				name: v.name,
				updated_at: new Date()
			})
			.where('ietf', '=', ietf);

		if (v.ietf) query = query.where('ietf', '!=', v.ietf);
		if (v.name) query = query.where('name', '!=', v.name);

		const r = await query.returningAll().executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				ietf: r.ietf,
				name: r.name
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_LANGUAGE_KEY) {
				throw new GenericError('same ietf already exists');
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteLanguageByIETF(db: DB, ietf: string): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.language')
			.where('ietf', '=', ietf)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsLanguageByIETF(db: DB, ietf: string): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.language')
						.where('ietf', '=', ietf)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countLanguage(db: DB, criteria: ParLanguage): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.language');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface WebsiteTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	domain: string;
	name: string;
}

const NAME_ERROR_WEBSITE_KEY = 'website_domain_key';

export async function insertWebsite(db: DB, v: NewWebsite): Promise<Website> {
	try {
		const r = await db
			.insertInto('donoengine.website')
			.values({
				domain: v.domain,
				name: v.name
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			domain: r.domain,
			name: r.name
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_WEBSITE_KEY) {
				throw new GenericError('same domain already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectWebsite(db: DB, criteria: ParWebsite): Promise<Website[]> {
	try {
		let query = db.selectFrom('donoengine.website');

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'domain':
					case 'name':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.selectAll().execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				domain: r.domain,
				name: r.name
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectWebsiteByDomain(db: DB, domain: string): Promise<Website | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.website')
			.where('domain', '=', domain)
			.selectAll()
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				domain: r.domain,
				name: r.name
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateWebsiteByDomain(
	db: DB,
	domain: string,
	v: SetWebsite
): Promise<Website | undefined> {
	try {
		let query = db
			.updateTable('donoengine.website')
			.set({
				domain: v.domain,
				name: v.name,
				updated_at: new Date()
			})
			.where('domain', '=', domain);

		if (v.domain) query = query.where('domain', '!=', v.domain);
		if (v.name) query = query.where('name', '!=', v.name);

		const r = await query.returningAll().executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				domain: r.domain,
				name: r.name
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_WEBSITE_KEY) {
				throw new GenericError('same domain already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteWebsiteByDomain(db: DB, domain: string): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.website')
			.where('domain', '=', domain)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsWebsiteByDomain(db: DB, domain: string): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.website')
						.where('domain', '=', domain)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countWebsite(db: DB, criteria: ParWebsite): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.website');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface CategoryTypeTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	code: string;
	name: string;
}

const NAME_ERROR_CATEGORYTYPE_KEY = 'category_type_code_key';

export async function insertCategoryType(db: DB, v: NewCategoryType): Promise<CategoryType> {
	try {
		const r = await db
			.insertInto('donoengine.category_type')
			.values({
				code: v.code,
				name: v.name
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			code: r.code,
			name: r.name
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_CATEGORYTYPE_KEY) {
				throw new GenericError('same code already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectCategoryType(
	db: DB,
	criteria: ParCategoryType
): Promise<CategoryType[]> {
	try {
		let query = db.selectFrom('donoengine.category_type');

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'code':
					case 'name':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.selectAll().execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectCategoryTypeByCode(
	db: DB,
	code: string
): Promise<CategoryType | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.category_type')
			.where('code', '=', code)
			.selectAll()
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateCategoryTypeByCode(
	db: DB,
	code: string,
	v: SetCategoryType
): Promise<CategoryType | undefined> {
	try {
		let query = db
			.updateTable('donoengine.category_type')
			.set({
				code: v.code,
				name: v.name,
				updated_at: new Date()
			})
			.where('code', '=', code);

		if (v.code) query = query.where('code', '!=', v.code);
		if (v.name) query = query.where('name', '!=', v.name);

		const r = await query.returningAll().executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_CATEGORYTYPE_KEY) {
				throw new GenericError('same code already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteCategoryTypeByCode(db: DB, code: string): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.category_type')
			.where('code', '=', code)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsCategoryTypeByCode(db: DB, code: string): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.category_type')
						.where('code', '=', code)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countCategoryType(db: DB, criteria: ParCategoryType): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.category_type');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface CategoryTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	type_id: number;
	code: string;
	name: string;
}

const NAME_ERROR_CATEGORY_KEY = 'category_type_id_code_key';
const NAME_ERROR_CATEGORY_FKEY = 'category_type_id_fkey';

export async function insertCategory(db: DB, v: NewCategory): Promise<Category> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.category')
					.values({
						type_id:
							v.typeID ?? v.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category_type')
											.select('id')
											.where('code', '=', v.typeCode ?? '')
								: 0,
						code: v.code,
						name: v.name
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.category_type as b', 'b.id', 'a.type_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'b.code',
				'a.name',
				'b.code as type_code'
			])
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			typeID: r.type_id,
			typeCode: r.type_code,
			code: r.code,
			name: r.name
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_CATEGORY_FKEY) {
						throw new GenericError('category type does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_CATEGORY_KEY) {
						throw new GenericError('same type id + code already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectCategory(db: DB, criteria: ParCategory): Promise<Category[]> {
	try {
		let query = db
			.selectFrom('donoengine.category as a')
			.innerJoin('donoengine.category_type as b', 'b.id', 'a.type_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'b.code',
				'a.name',
				'b.code as type_code'
			]);

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'type_id':
					case 'type_code':
					case 'code':
					case 'name':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				typeCode: r.type_code,
				code: r.code,
				name: r.name
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectCategoryBySID(db: DB, sid: CategorySID): Promise<Category | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.category as a')
			.innerJoin('donoengine.category_type as b', 'b.id', 'a.type_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'b.code',
				'a.name',
				'b.code as type_code'
			])
			.where(
				'type_id',
				'=',
				sid.typeID ?? sid.typeCode
					? (eb) =>
							eb
								.selectFrom('b')
								.select('id')
								.where('code', '=', sid.typeCode ?? '')
					: 0
			)
			.where('code', '=', sid.code)
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				typeCode: r.type_code,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateCategoryBySID(
	db: DB,
	sid: CategorySID,
	v: SetCategory
): Promise<Category | undefined> {
	try {
		const query = async function (qc: QueryCreator<Database>) {
			return await qc
				.with('a', (qc) => {
					let query = qc
						.updateTable('donoengine.category')
						.set({
							type_id:
								v.typeID ?? v.typeCode
									? (eb) =>
											eb
												.selectFrom('donoengine.category_type')
												.select('id')
												.where('code', '=', v.typeCode ?? '')
									: undefined,
							code: v.code,
							name: v.name,
							updated_at: new Date()
						})
						.where(
							'type_id',
							'=',
							sid.typeID ?? sid.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category_type')
											.select('id')
											.where('code', '=', sid.typeCode ?? '')
								: 0
						)
						.where('code', '=', sid.code);

					if (v.typeID || v.typeCode) {
						query = query.where(
							'type_id',
							'!=',
							v.typeID ?? v.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category_type')
											.select('id')
											.where('code', '=', sid.typeCode ?? '')
								: 0
						);
					}
					if (v.code) query = query.where('code', '!=', v.code);
					if (v.name) query = query.where('name', '!=', v.name);

					return query.returningAll();
				})
				.selectFrom('a')
				.innerJoin('donoengine.category_type as b', 'b.id', 'a.type_id')
				.select([
					'a.id',
					'a.created_at',
					'a.updated_at',
					'a.type_id',
					'b.code',
					'a.name',
					'b.code as type_code'
				])
				.executeTakeFirst();
		};

		if (v.typeID || v.typeCode) {
			return db.transaction().execute(async (tx) => {
				const r = await query(tx);

				if (r) {
					if (v.typeID ? r.type_id != v.typeID : v.typeCode ? r.type_code != v.typeCode : false) {
						await tx
							.deleteFrom('donoengine.category_relation')
							.where('parent_id', '=', r.id)
							.execute();
					}

					return {
						id: r.id,
						createdAt: r.created_at,
						updatedAt: r.updated_at,
						typeID: r.type_id,
						typeCode: r.type_code,
						code: r.code,
						name: r.name
					};
				}
			});
		}

		const r = await query(db);

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				typeCode: r.type_code,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_CATEGORY_FKEY) {
						throw new GenericError('category type does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_CATEGORY_KEY) {
						throw new GenericError('same type id + code already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteCategoryBySID(db: DB, sid: CategorySID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.category')
			.where(
				'type_id',
				'=',
				sid.typeID ?? sid.typeCode
					? (eb) =>
							eb
								.selectFrom('donoengine.category_type')
								.select('id')
								.where('code', '=', sid.typeCode ?? '')
					: 0
			)
			.where('code', '=', sid.code)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsCategoryBySID(db: DB, sid: CategorySID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.category')
						.where(
							'type_id',
							'=',
							sid.typeID ?? sid.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category_type')
											.select('id')
											.where('code', '=', sid.typeCode ?? '')
								: 0
						)
						.where('code', '=', sid.code)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countCategory(db: DB, criteria: ParCategory): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.category');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface CategoryRelationTable {
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	parent_id: number;
	child_id: number;
}

const NAME_ERROR_CATEGORYRELATION_PKEY = 'category_relation_pkey';
const NAME_ERROR_CATEGORYRELATION_FKEY0 = 'category_relation_parent_id_fkey';
const NAME_ERROR_CATEGORYRELATION_FKEY1 = 'category_relation_child_id_fkey';
const NAME_ERROR_CATEGORYRELATION_CHECK = 'category_relation_parent_id_child_id_check';

export async function insertCategoryRelation(
	db: DB,
	v: NewCategoryRelation
): Promise<CategoryRelation> {
	try {
		const query = async function (qc: QueryCreator<Database>) {
			return await qc
				.with('a', (qc) =>
					qc
						.insertInto('donoengine.category_relation')
						.values({
							parent_id:
								v.parentID ?? v.parentCode
									? (eb) =>
											eb
												.selectFrom('donoengine.category')
												.select('id')
												.where(
													'type_id',
													'=',
													v.typeID ?? v.typeCode
														? (eb) =>
																eb
																	.selectFrom('donoengine.category_type')
																	.select('id')
																	.where('code', '=', v.typeCode ?? '')
														: 0
												)
												.where('code', '=', v.parentCode ?? '')
									: 0,
							child_id:
								v.childID ?? v.childCode
									? (eb) =>
											eb
												.selectFrom('donoengine.category')
												.select('id')
												.where(
													'type_id',
													'=',
													v.typeID ?? v.typeCode
														? (eb) =>
																eb
																	.selectFrom('donoengine.category_type')
																	.select('id')
																	.where('code', '=', v.typeCode ?? '')
														: 0
												)
												.where('code', '=', v.childCode ?? '')
									: 0
						})
						.returningAll()
				)
				.selectFrom('a')
				.innerJoin('donoengine.category as b', 'b.id', 'a.child_id')
				.select([
					'a.created_at',
					'a.updated_at',
					'a.parent_id',
					'a.child_id',
					'b.code as child_code'
				])
				.executeTakeFirstOrThrow();
		};

		return db.transaction().execute(async (tx) => {
			const r = await query(tx);

			if (
				await sql<boolean>`
			WITH RECURSIVE childs AS (
				SELECT child_id, parent_id
					FROM ${sql.table('donoengine.category')}
				UNION SELECT childs.child_id, parents.parent_id
					FROM ${sql.table('donoengine.category')} AS parents
				JOIN childs ON childs.parent_id = parents.child_id
			) SELECT (${r.parent_id}, ${r.child_id}) IN (SELECT * FROM childs)
			`
					.execute(tx)
					.then((v) => v.rows[0] ?? false)
			) {
				throw new GenericError('category relation loop detected');
			}

			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				parentID: r.parent_id,
				childID: r.child_id,
				childCode: r.child_code
			};
		});
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_CATEGORYRELATION_FKEY0:
							throw new GenericError('parent category does not exist');
						case NAME_ERROR_CATEGORYRELATION_FKEY1:
							throw new GenericError('child category does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_CATEGORYRELATION_PKEY) {
						throw new GenericError('same child id already exists');
					}
					break;
				case CODE_ERROR_VALIDATION:
					if (e.constraint == NAME_ERROR_CATEGORYRELATION_CHECK) {
						throw new GenericError('parent category and child category cannot be same');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectCategoryRelation(
	db: DB,
	criteria: ParCategoryRelation
): Promise<CategoryRelation[]> {
	try {
		let query = db
			.selectFrom('donoengine.category_relation as a')
			.innerJoin('donoengine.category as b', 'b.id', 'a.child_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.parent_id',
				'a.child_id',
				'b.code as child_code'
			]);

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'created_at':
					case 'updated_at':
					case 'type_id':
					case 'parent_id':
					case 'child_id':
					case 'child_code':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				parentID: r.parent_id,
				childID: r.child_id,
				childCode: r.child_code
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectCategoryRelationBySID(
	db: DB,
	sid: CategoryRelationSID
): Promise<CategoryRelation | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.category_relation as a')
			.where(
				'parent_id',
				'=',
				sid.parentID ?? sid.parentCode
					? (eb) =>
							eb
								.selectFrom('donoengine.category')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.typeID ?? sid.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.category_type')
													.select('id')
													.where('code', '=', sid.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.parentCode ?? '')
					: 0
			)
			.where(
				'child_id',
				'=',
				sid.childID ?? sid.childCode
					? (eb) =>
							eb
								.selectFrom('donoengine.category')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.typeID ?? sid.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.category_type')
													.select('id')
													.where('code', '=', sid.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.childCode ?? '')
					: 0
			)
			.innerJoin('donoengine.category as b', 'b.id', 'a.child_id')
			.select(['a.created_at', 'a.updated_at', 'a.parent_id', 'a.child_id', 'b.code as child_code'])
			.executeTakeFirst();

		if (r)
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				parentID: r.parent_id,
				childID: r.child_id,
				childCode: r.child_code
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateCategoryRelationBySID(
	db: DB,
	sid: CategoryRelationSID,
	v: SetCategoryRelation
): Promise<CategoryRelation | undefined> {
	try {
		const query = async function (qc: QueryCreator<Database>) {
			return await qc
				.with('a', (qc) => {
					let query = qc
						.updateTable('donoengine.category_relation')
						.set({
							parent_id:
								v.parentID ?? v.parentCode
									? (eb) =>
											eb
												.selectFrom('donoengine.category')
												.select('id')
												.where(
													'type_id',
													'=',
													v.typeID ?? v.typeCode
														? (eb) =>
																eb
																	.selectFrom('donoengine.category_type')
																	.select('id')
																	.where('code', '=', v.typeCode ?? '')
														: 0
												)
												.where('code', '=', v.parentCode ?? '')
									: undefined,
							child_id:
								v.childID ?? v.childCode
									? (eb) =>
											eb
												.selectFrom('donoengine.category')
												.select('id')
												.where(
													'type_id',
													'=',
													v.typeID ?? v.typeCode
														? (eb) =>
																eb
																	.selectFrom('donoengine.category_type')
																	.select('id')
																	.where('code', '=', v.typeCode ?? '')
														: 0
												)
												.where('code', '=', v.childCode ?? '')
									: undefined,
							updated_at: new Date()
						})
						.where(
							'parent_id',
							'=',
							sid.parentID ?? sid.parentCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												sid.typeID ?? sid.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', sid.typeCode ?? '')
													: 0
											)
											.where('code', '=', sid.parentCode ?? '')
								: 0
						)
						.where(
							'child_id',
							'=',
							sid.childID ?? sid.childCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												sid.typeID ?? sid.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', sid.typeCode ?? '')
													: 0
											)
											.where('code', '=', sid.childCode ?? '')
								: 0
						);

					if (v.parentID || v.parentCode) {
						query = query.where(
							'parent_id',
							'!=',
							v.parentID ?? v.parentCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												v.typeID ?? v.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', v.typeCode ?? '')
													: 0
											)
											.where('code', '=', v.parentCode ?? '')
								: 0
						);
					}
					if (v.childID || v.childCode) {
						query = query.where(
							'child_id',
							'=',
							v.childID ?? v.childCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												v.typeID ?? v.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', v.typeCode ?? '')
													: 0
											)
											.where('code', '=', v.childCode ?? '')
								: 0
						);
					}

					return query.returningAll();
				})
				.selectFrom('a')
				.innerJoin('donoengine.category as b', 'a.child_id', 'b.id')
				.select([
					'a.created_at',
					'a.updated_at',
					'a.parent_id',
					'a.child_id',
					'b.code as child_code'
				])
				.executeTakeFirst();
		};

		return db.transaction().execute(async (tx) => {
			const r = await query(tx);

			if (r) {
				if (
					await sql<boolean>`
				WITH RECURSIVE childs AS (
					SELECT child_id, parent_id
						FROM ${sql.table('donoengine.category')}
					UNION SELECT childs.child_id, parents.parent_id
						FROM ${sql.table('donoengine.category')} AS parents
					JOIN childs ON childs.parent_id = parents.child_id
				) SELECT (${r.parent_id}, ${r.child_id}) IN (SELECT * FROM childs)
				`
						.execute(tx)
						.then((v) => v.rows[0] ?? false)
				) {
					throw new GenericError('category relation loop detected');
				}

				return {
					createdAt: r.created_at,
					updatedAt: r.updated_at,
					parentID: r.parent_id,
					childID: r.child_id,
					childCode: r.child_code
				};
			}
		});
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_CATEGORYRELATION_FKEY0:
							throw new GenericError('parent category does not exist');
						case NAME_ERROR_CATEGORYRELATION_FKEY1:
							throw new GenericError('child category does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_CATEGORYRELATION_PKEY) {
						throw new GenericError('same child id already exists');
					}
					break;
				case CODE_ERROR_VALIDATION:
					if (e.constraint == NAME_ERROR_CATEGORYRELATION_CHECK) {
						throw new GenericError('parent category and child category cannot be same');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteCategoryRelationBySID(
	db: DB,
	sid: CategoryRelationSID
): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.category_relation')
			.where(
				'parent_id',
				'=',
				sid.parentID ?? sid.parentCode
					? (eb) =>
							eb
								.selectFrom('donoengine.category')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.typeID ?? sid.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.category_type')
													.select('id')
													.where('code', '=', sid.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.parentCode ?? '')
					: 0
			)
			.where(
				'child_id',
				'=',
				sid.childID ?? sid.childCode
					? (eb) =>
							eb
								.selectFrom('donoengine.category')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.typeID ?? sid.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.category_type')
													.select('id')
													.where('code', '=', sid.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.childCode ?? '')
					: 0
			)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsCategoryRelationBySID(
	db: DB,
	sid: CategoryRelationSID
): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.category_relation')
						.where(
							'parent_id',
							'=',
							sid.parentID ?? sid.parentCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												sid.typeID ?? sid.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', sid.typeCode ?? '')
													: 0
											)
											.where('code', '=', sid.parentCode ?? '')
								: 0
						)
						.where(
							'child_id',
							'=',
							sid.childID ?? sid.childCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												sid.typeID ?? sid.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', sid.typeCode ?? '')
													: 0
											)
											.where('code', '=', sid.childCode ?? '')
								: 0
						)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countCategoryRelation(
	db: DB,
	criteria: ParCategoryRelation
): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.category_relation');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface TagTypeTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	code: string;
	name: string;
}

const NAME_ERROR_TAGTYPE_KEY = 'tag_type_code_key';

export async function insertTagType(db: DB, v: NewTagType): Promise<TagType> {
	try {
		const r = await db
			.insertInto('donoengine.tag_type')
			.values({
				code: v.code,
				name: v.name
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			code: r.code,
			name: r.name
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_TAGTYPE_KEY) {
				throw new GenericError('same code already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectTagType(db: DB, criteria: ParTagType): Promise<TagType[]> {
	try {
		let query = db.selectFrom('donoengine.tag_type');

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'code':
					case 'name':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.selectAll().execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectTagTypeByCode(db: DB, code: string): Promise<TagType | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.tag_type')
			.where('code', '=', code)
			.selectAll()
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateTagTypeByCode(
	db: DB,
	code: string,
	v: SetTagType
): Promise<TagType | undefined> {
	try {
		let query = db
			.updateTable('donoengine.tag_type')
			.set({
				code: v.code,
				name: v.name,
				updated_at: new Date()
			})
			.where('code', '=', code);

		if (v.code) query = query.where('code', '!=', v.code);
		if (v.name) query = query.where('name', '!=', v.name);

		const r = await query.returningAll().executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_TAGTYPE_KEY) {
				throw new GenericError('same code already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteTagTypeByCode(db: DB, code: string): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.tag_type')
			.where('code', '=', code)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsTagTypeByCode(db: DB, code: string): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.tag_type')
						.where('code', '=', code)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countTagType(db: DB, criteria: ParTagType): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.tag_type');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface TagTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	type_id: number;
	code: string;
	name: string;
}

const NAME_ERROR_TAG_KEY = 'tag_type_id_code_key';
const NAME_ERROR_TAG_FKEY = 'tag_type_id_fkey';

export async function insertTag(db: DB, v: NewTag): Promise<Tag> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.tag')
					.values({
						type_id:
							v.typeID ?? v.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.tag_type')
											.select('id')
											.where('code', '=', v.typeCode ?? '')
								: 0,
						code: v.code,
						name: v.name
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.tag_type as b', 'b.id', 'a.type_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'b.code',
				'a.name',
				'b.code as type_code'
			])
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			typeID: r.type_id,
			typeCode: r.type_code,
			code: r.code,
			name: r.name
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_TAG_FKEY) {
						throw new GenericError('tag type does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_TAG_KEY) {
						throw new GenericError('same type id + code already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectTag(db: DB, criteria: ParTag): Promise<Tag[]> {
	try {
		let query = db
			.selectFrom('donoengine.tag as a')
			.innerJoin('donoengine.tag_type as b', 'b.id', 'a.type_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'b.code',
				'a.name',
				'b.code as type_code'
			]);

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'type_id':
					case 'type_code':
					case 'code':
					case 'name':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				typeCode: r.type_code,
				code: r.code,
				name: r.name
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectTagBySID(db: DB, sid: TagSID): Promise<Tag | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.tag as a')
			.innerJoin('donoengine.tag_type as b', 'b.id', 'a.type_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'b.code',
				'a.name',
				'b.code as type_code'
			])
			.where(
				'type_id',
				'=',
				sid.typeID ?? sid.typeCode
					? (eb) =>
							eb
								.selectFrom('b')
								.select('id')
								.where('code', '=', sid.typeCode ?? '')
					: 0
			)
			.where('code', '=', sid.code)
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				typeCode: r.type_code,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateTagBySID(db: DB, sid: TagSID, v: SetTag): Promise<Tag | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.tag')
					.set({
						type_id:
							v.typeID ?? v.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.tag_type')
											.select('id')
											.where('code', '=', v.typeCode ?? '')
								: undefined,
						code: v.code,
						name: v.name,
						updated_at: new Date()
					})
					.where(
						'type_id',
						'=',
						sid.typeID ?? sid.typeCode
							? (eb) =>
									eb
										.selectFrom('donoengine.tag_type')
										.select('id')
										.where('code', '=', sid.typeCode ?? '')
							: 0
					)
					.where('code', '=', sid.code);

				if (v.typeID || v.typeCode) {
					query = query.where(
						'type_id',
						'!=',
						v.typeID ?? v.typeCode
							? (eb) =>
									eb
										.selectFrom('donoengine.tag_type')
										.select('id')
										.where('code', '=', sid.typeCode ?? '')
							: 0
					);
				}
				if (v.code) query = query.where('code', '!=', v.code);
				if (v.name) query = query.where('name', '!=', v.name);

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.tag_type as b', 'b.id', 'a.type_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'b.code',
				'a.name',
				'b.code as type_code'
			])
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				typeCode: r.type_code,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_TAG_FKEY) {
						throw new GenericError('tag type does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_TAG_KEY) {
						throw new GenericError('same type id + code already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteTagBySID(db: DB, sid: TagSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.tag')
			.where(
				'type_id',
				'=',
				sid.typeID ?? sid.typeCode
					? (eb) =>
							eb
								.selectFrom('donoengine.tag_type')
								.select('id')
								.where('code', '=', sid.typeCode ?? '')
					: 0
			)
			.where('code', '=', sid.code)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsTagBySID(db: DB, sid: TagSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.tag')
						.where(
							'type_id',
							'=',
							sid.typeID ?? sid.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.tag_type')
											.select('id')
											.where('code', '=', sid.typeCode ?? '')
								: 0
						)
						.where('code', '=', sid.code)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countTag(db: DB, criteria: ParTag): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.tag');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	code: string;
	language_id: number | null;
	published_from: ColumnType<Date | null, Date | undefined, Date | null>;
	published_to: ColumnType<Date | null, Date | undefined, Date | null>;
	total_chapter: number | null;
	total_volume: number | null;
	nsfw: number | null;
	nsfl: number | null;
	additionals: JSON | null;
}

const NAME_ERROR_COMIC_KEY = 'comic_code_key';
const NAME_ERROR_COMIC_FKEY = 'comic_language_id_fkey';

export async function insertComic(db: DB, v: NewComic): Promise<Comic> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.comic')
					.values({
						code: v.code,
						language_id:
							v.languageID ?? v.languageIETF
								? (eb) =>
										eb
											.selectFrom('donoengine.language')
											.select('id')
											.where('ietf', '=', v.languageIETF ?? '')
								: undefined,
						published_from: v.publishedFrom,
						published_to: v.publishedTo,
						total_chapter: v.totalChapter,
						total_volume: v.totalVolume,
						nsfw: v.nsfw,
						nsfl: v.nsfl,
						additionals: v.additionals
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.code',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.published_from',
				'a.published_to',
				'a.total_chapter',
				'a.total_volume',
				'a.nsfw',
				'a.nsfl',
				'a.additionals'
			])
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			code: r.code,
			languageID: r.language_id,
			languageIETF: r.language_ietf,
			publishedFrom: r.published_from,
			publishedTo: r.published_to,
			totalChapter: r.total_chapter,
			totalVolume: r.total_volume,
			nsfw: r.nsfw,
			nsfl: r.nsfl,
			additionals: r.additionals
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_COMIC_FKEY) {
						throw new GenericError('language does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMIC_KEY) {
						throw new GenericError('same code already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComic(db: DB, criteria: ParComic): Promise<Comic[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic as a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.$if(criteria.comicExternals !== undefined && criteria.comicExternals.size > 0, (qb) => {
				let query = qb
					.leftJoin('donoengine.comic_external as ce', 'ce.comic_id', 'a.id')
					.innerJoin('donoengine.website as cew', 'cew.id', 'ce.website_id')
					.distinctOn('a.id');

				criteria.comicExternals?.forEach((v, k) => {
					switch (k) {
						case 'websiteID':
							query = query.where('ce.website_id', '=', Number(v));
							break;
						case 'websiteDomain':
							query = query.where('cew.domain', '=', String(v));
							break;
						case 'relativeURL':
							const v0 = v != null ? String(v) : null;
							query = query.where('ce.relative_url', 'is distinct from', v0);
							break;
						case 'official':
							const v1 = v != null ? Boolean(v) : null;
							query = query.where('ce.official', 'is distinct from', v1);
							break;
					}
				});

				return query;
			})
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.code',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.published_from',
				'a.published_to',
				'a.total_chapter',
				'a.total_volume',
				'a.nsfw',
				'a.nsfl',
				'a.additionals'
			]);

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'code':
					case 'language_id':
					case 'language_ietf':
					case 'published_from':
					case 'published_to':
					case 'total_chapter':
					case 'total_volume':
					case 'nsfw':
					case 'nsfl':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				publishedFrom: r.published_from,
				publishedTo: r.published_to,
				totalChapter: r.total_chapter,
				totalVolume: r.total_volume,
				nsfw: r.nsfw,
				nsfl: r.nsfl,
				additionals: r.additionals
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicByCode(db: DB, code: string): Promise<Comic | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic as a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.where('code', '=', code)
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.code',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.published_from',
				'a.published_to',
				'a.total_chapter',
				'a.total_volume',
				'a.nsfw',
				'a.nsfl',
				'a.additionals'
			])
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				publishedFrom: r.published_from,
				publishedTo: r.published_to,
				totalChapter: r.total_chapter,
				totalVolume: r.total_volume,
				nsfw: r.nsfw,
				nsfl: r.nsfl,
				additionals: r.additionals
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicByCode(
	db: DB,
	code: string,
	v: SetComic
): Promise<Comic | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.comic')
					.set({
						code: v.code,
						language_id:
							v.languageID ?? v.languageIETF
								? (eb) =>
										eb
											.selectFrom('donoengine.language')
											.select('id')
											.where('ietf', '=', v.languageIETF ?? '')
								: undefined,
						published_from: v.publishedFrom,
						published_to: v.publishedTo,
						total_chapter: v.totalChapter,
						total_volume: v.totalVolume,
						nsfw: v.nsfw,
						nsfl: v.nsfl,
						additionals: v.additionals,
						updated_at: new Date()
					})
					.where('code', '=', code);

				if (v.code) query = query.where('code', '!=', v.code);
				if (v.languageID !== undefined || v.languageIETF !== undefined) {
					query = query.where(
						'language_id',
						'is not distinct from',
						v.languageID ?? v.languageIETF
							? (eb) =>
									eb
										.selectFrom('donoengine.language')
										.select('id')
										.where('ietf', '=', v.languageIETF ?? '')
							: null
					);
				}
				if (v.publishedFrom !== undefined)
					query = query.where('published_from', 'is not distinct from', v.publishedFrom);
				if (v.publishedTo !== undefined)
					query = query.where('published_to', 'is not distinct from', v.publishedTo);
				if (v.totalChapter !== undefined)
					query = query.where('total_chapter', 'is not distinct from', v.totalChapter);
				if (v.totalVolume !== undefined)
					query = query.where('total_volume', 'is not distinct from', v.totalVolume);
				if (v.nsfw !== undefined) query = query.where('nsfw', 'is not distinct from', v.nsfw);
				if (v.nsfl !== undefined) query = query.where('nsfl', 'is not distinct from', v.nsfl);
				if (v.additionals !== undefined)
					query = query.where('additionals', 'is not distinct from', v.additionals);

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.code',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.published_from',
				'a.published_to',
				'a.total_chapter',
				'a.total_volume',
				'a.nsfw',
				'a.nsfl',
				'a.additionals'
			])
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				publishedFrom: r.published_from,
				publishedTo: r.published_to,
				totalChapter: r.total_chapter,
				totalVolume: r.total_volume,
				nsfw: r.nsfw,
				nsfl: r.nsfl,
				additionals: r.additionals
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_COMIC_FKEY) {
						throw new GenericError('language does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMIC_KEY) {
						throw new GenericError('same code already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicByCode(db: DB, code: string): Promise<boolean> {
	try {
		const r = await db.deleteFrom('donoengine.comic').where('code', '=', code).executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicByCode(db: DB, code: string): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic')
						.where('code', '=', code)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComic(db: DB, criteria: ParComic): Promise<number> {
	try {
		let distinct = false;

		let query = db
			.selectFrom('donoengine.comic as a')
			.$if(criteria.comicExternals !== undefined && criteria.comicExternals.size > 0, (qb) => {
				distinct = true;

				let query = qb
					.leftJoin('donoengine.comic_external as ce', 'ce.comic_id', 'a.id')
					.innerJoin('donoengine.website as cew', 'cew.id', 'ce.website_id');

				criteria.comicExternals?.forEach((v, k) => {
					switch (k) {
						case 'websiteID':
							query = query.where('ce.website_id', '=', Number(v));
							break;
						case 'websiteDomain':
							query = query.where('cew.domain', '=', String(v));
							break;
						case 'relativeURL':
							const v0 = v != null ? String(v) : null;
							query = query.where('ce.relative_url', 'is distinct from', v0);
							break;
						case 'official':
							const v1 = v != null ? Boolean(v) : null;
							query = query.where('ce.official', 'is distinct from', v1);
							break;
					}
				});

				return query;
			});

		const { count } = await query
			.select((eb) => {
				if (distinct) {
					return eb.fn.count<number>(sql`distinct ${sql.ref('a.id')}`).as('count');
				}
				return eb.fn.countAll<number>().as('count');
			})
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicTitleTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	comic_id: number;
	rid: string;
	language_id: number;
	title: string;
	synonym: boolean | null;
	romanized: boolean | null;
}

const NAME_ERROR_COMICTITLE_KEY0 = 'comic_title_comic_id_rid_key';
const NAME_ERROR_COMICTITLE_KEY1 = 'comic_title_comic_id_title_key';
const NAME_ERROR_COMICTITLE_FKEY0 = 'comic_title_comic_id_fkey';
const NAME_ERROR_COMICTITLE_FKEY1 = 'comic_title_language_id_fkey';

export async function insertComicTitle(db: DB, v: NewComicTitle): Promise<ComicTitle> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.comic_title')
					.values({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: 0,
						rid: v.rid,
						language_id:
							v.languageID ?? v.languageIETF
								? (eb) =>
										eb
											.selectFrom('donoengine.language')
											.select('id')
											.where('ietf', '=', v.languageIETF ?? '')
								: 0,
						title: v.title,
						synonym: v.synonym,
						romanized: v.romanized
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.title',
				'a.synonym',
				'a.romanized'
			])
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			comicID: r.comic_id,
			rid: r.rid,
			languageID: r.language_id,
			languageIETF: r.language_ietf,
			title: r.title,
			synonym: r.synonym,
			romanized: r.romanized
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICTITLE_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICTITLE_FKEY1:
							throw new GenericError('language does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICTITLE_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICTITLE_KEY1:
							throw new GenericError('same comic id + title already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicTitle(db: DB, criteria: ParComicTitle): Promise<ComicTitle[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic_title as a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.title',
				'a.synonym',
				'a.romanized'
			]);

		if (criteria.comicIDs && criteria.comicIDs.length > 0)
			if (criteria.comicIDs.length == 1) {
				query = query.where('a.comic_id', '=', criteria.comicIDs[0]);
			} else {
				query = query.where('a.comic_id', 'in', criteria.comicIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'comic_id':
					case 'rid':
					case 'language_id':
					case 'language_ietf':
					case 'title':
					case 'synonym':
					case 'romanized':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				title: r.title,
				synonym: r.synonym,
				romanized: r.romanized
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicTitleBySID(
	db: DB,
	sid: ComicGenericSID
): Promise<ComicTitle | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_title as a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.title',
				'a.synonym',
				'a.romanized'
			])
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				title: r.title,
				synonym: r.synonym,
				romanized: r.romanized
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicTitleBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicTitle
): Promise<ComicTitle | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.comic_title')
					.set({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: undefined,
						rid: v.rid,
						language_id:
							v.languageID ?? v.languageIETF
								? (eb) =>
										eb
											.selectFrom('donoengine.language')
											.select('id')
											.where('ietf', '=', v.languageIETF ?? '')
								: undefined,
						title: v.title,
						synonym: v.synonym,
						romanized: v.romanized,
						updated_at: new Date()
					})
					.where(
						'comic_id',
						'=',
						sid.comicID ?? sid.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', sid.comicCode ?? '')
							: 0
					)
					.where('rid', '=', sid.rid);

				if (v.comicID || v.comicCode) {
					query = query.where(
						'comic_id',
						'!=',
						v.comicID ?? v.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', v.comicCode ?? '')
							: 0
					);
				}
				if (v.rid) query = query.where('rid', '!=', v.rid);
				if (v.languageID || v.languageIETF) {
					query = query.where(
						'language_id',
						'!=',
						v.languageID ?? v.languageIETF
							? (eb) =>
									eb
										.selectFrom('donoengine.language')
										.select('id')
										.where('ietf', '=', v.languageIETF ?? '')
							: 0
					);
				}
				if (v.title) query = query.where('title', '!=', v.title);
				if (v.synonym !== undefined)
					query = query.where('synonym', 'is not distinct from', v.synonym);
				if (v.romanized !== undefined)
					query = query.where('romanized', 'is not distinct from', v.romanized);

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.title',
				'a.synonym',
				'a.romanized'
			])
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				title: r.title,
				synonym: r.synonym,
				romanized: r.romanized
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICTITLE_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICTITLE_FKEY1:
							throw new GenericError('language does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICTITLE_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICTITLE_KEY1:
							throw new GenericError('same comic id + title already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicTitleBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_title')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicTitleBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_title')
						.where(
							'comic_id',
							'=',
							sid.comicID ?? sid.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.comicCode ?? '')
								: 0
						)
						.where('rid', '=', sid.rid)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicTitle(db: DB, criteria: ParComicTitle): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_title');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicCoverTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	comic_id: number;
	rid: string;
	website_id: number;
	relative_url: string;
	priority: number | null;
}

const NAME_ERROR_COMICCOVER_KEY0 = 'comic_cover_comic_id_rid_key';
const NAME_ERROR_COMICCOVER_KEY1 = 'comic_cover_comic_id_website_id_relative_url_key';
const NAME_ERROR_COMICCOVER_FKEY0 = 'comic_cover_comic_id_fkey';
const NAME_ERROR_COMICCOVER_FKEY1 = 'comic_cover_website_id_fkey';

export async function insertComicCover(db: DB, v: NewComicCover): Promise<ComicCover> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.comic_cover')
					.values({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: 0,
						rid: v.rid,
						website_id:
							v.websiteID ?? v.websiteDomain
								? (eb) =>
										eb
											.selectFrom('donoengine.website')
											.select('id')
											.where('domain', '=', v.websiteDomain ?? '')
								: 0,
						relative_url: v.relativeURL,
						priority: v.priority
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.priority'
			])
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			comicID: r.comic_id,
			rid: r.rid,
			websiteID: r.website_id,
			websiteDomain: r.website_domain,
			relativeURL: r.relative_url,
			priority: r.priority
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICCOVER_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICCOVER_FKEY1:
							throw new GenericError('website does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICCOVER_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICCOVER_KEY1:
							throw new GenericError('same comic id + website id + relative url already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicCover(db: DB, criteria: ParComicCover): Promise<ComicCover[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic_cover as a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.priority'
			]);

		if (criteria.comicIDs && criteria.comicIDs.length > 0)
			if (criteria.comicIDs.length == 1) {
				query = query.where('a.comic_id', '=', criteria.comicIDs[0]);
			} else {
				query = query.where('a.comic_id', 'in', criteria.comicIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'comic_id':
					case 'rid':
					case 'website_id':
					case 'website_domain':
					case 'relative_url':
					case 'priority':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				websiteID: r.website_id,
				websiteDomain: r.website_domain,
				relativeURL: r.relative_url,
				priority: r.priority
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicCoverBySID(
	db: DB,
	sid: ComicGenericSID
): Promise<ComicCover | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_cover as a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.priority'
			])
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				websiteID: r.website_id,
				websiteDomain: r.website_domain,
				relativeURL: r.relative_url,
				priority: r.priority
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicCoverBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicCover
): Promise<ComicCover | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.comic_cover')
					.set({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: undefined,
						rid: v.rid,
						website_id:
							v.websiteID ?? v.websiteDomain
								? (eb) =>
										eb
											.selectFrom('donoengine.website')
											.select('id')
											.where('domain', '=', v.websiteDomain ?? '')
								: undefined,
						relative_url: v.relativeURL,
						priority: v.priority,
						updated_at: new Date()
					})
					.where(
						'comic_id',
						'=',
						sid.comicID ?? sid.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', sid.comicCode ?? '')
							: 0
					)
					.where('rid', '=', sid.rid);

				if (v.comicID || v.comicCode) {
					query = query.where(
						'comic_id',
						'!=',
						v.comicID ?? v.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', v.comicCode ?? '')
							: 0
					);
				}
				if (v.rid) query = query.where('rid', '!=', v.rid);
				if (v.websiteID || v.websiteDomain) {
					query = query.where(
						'website_id',
						'!=',
						v.websiteID ?? v.websiteDomain
							? (eb) =>
									eb
										.selectFrom('donoengine.website')
										.select('id')
										.where('domain', '=', v.websiteDomain ?? '')
							: 0
					);
				}
				if (v.relativeURL) query = query.where('relative_url', '!=', v.relativeURL);
				if (v.priority !== undefined)
					query = query.where('priority', 'is not distinct from', v.priority);

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.priority'
			])
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				websiteID: r.website_id,
				websiteDomain: r.website_domain,
				relativeURL: r.relative_url,
				priority: r.priority
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICCOVER_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICCOVER_FKEY1:
							throw new GenericError('website does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICCOVER_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICCOVER_KEY1:
							throw new GenericError('same comic id + website id + relative url already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicCoverBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_cover')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicCoverBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_cover')
						.where(
							'comic_id',
							'=',
							sid.comicID ?? sid.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.comicCode ?? '')
								: 0
						)
						.where('rid', '=', sid.rid)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicCover(db: DB, criteria: ParComicCover): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_cover');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicSynopsisTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	comic_id: number;
	rid: string;
	language_id: number;
	synopsis: string;
	version: string | null;
	romanized: boolean | null;
}

const NAME_ERROR_COMICSYNOPSIS_KEY0 = 'comic_synopsis_comic_id_rid_key';
const NAME_ERROR_COMICSYNOPSIS_KEY1 = 'comic_synopsis_comic_id_synopsis_key';
const NAME_ERROR_COMICSYNOPSIS_FKEY0 = 'comic_synopsis_comic_id_fkey';
const NAME_ERROR_COMICSYNOPSIS_FKEY1 = 'comic_synopsis_language_id_fkey';

export async function insertComicSynopsis(db: DB, v: NewComicSynopsis): Promise<ComicSynopsis> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.comic_synopsis')
					.values({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: 0,
						rid: v.rid,
						language_id:
							v.languageID ?? v.languageIETF
								? (eb) =>
										eb
											.selectFrom('donoengine.language')
											.select('id')
											.where('ietf', '=', v.languageIETF ?? '')
								: 0,
						synopsis: v.synopsis,
						version: v.version,
						romanized: v.romanized
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.synopsis',
				'a.version',
				'a.romanized'
			])
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			comicID: r.comic_id,
			rid: r.rid,
			languageID: r.language_id,
			languageIETF: r.language_ietf,
			synopsis: r.synopsis,
			version: r.version,
			romanized: r.romanized
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICSYNOPSIS_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICSYNOPSIS_FKEY1:
							throw new GenericError('language does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICSYNOPSIS_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICSYNOPSIS_KEY1:
							throw new GenericError('same comic id + synopsis already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicSynopsis(
	db: DB,
	criteria: ParComicSynopsis
): Promise<ComicSynopsis[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic_synopsis as a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.synopsis',
				'a.version',
				'a.romanized'
			]);

		if (criteria.comicIDs && criteria.comicIDs.length > 0)
			if (criteria.comicIDs.length == 1) {
				query = query.where('a.comic_id', '=', criteria.comicIDs[0]);
			} else {
				query = query.where('a.comic_id', 'in', criteria.comicIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'comic_id':
					case 'rid':
					case 'language_id':
					case 'language_ietf':
					case 'synopsis':
					case 'version':
					case 'romanized':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				synopsis: r.synopsis,
				version: r.version,
				romanized: r.romanized
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicSynopsisBySID(
	db: DB,
	sid: ComicGenericSID
): Promise<ComicSynopsis | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_synopsis as a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.synopsis',
				'a.version',
				'a.romanized'
			])
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				synopsis: r.synopsis,
				version: r.version,
				romanized: r.romanized
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicSynopsisBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicSynopsis
): Promise<ComicSynopsis | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.comic_synopsis')
					.set({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: undefined,
						rid: v.rid,
						language_id:
							v.languageID ?? v.languageIETF
								? (eb) =>
										eb
											.selectFrom('donoengine.language')
											.select('id')
											.where('ietf', '=', v.languageIETF ?? '')
								: undefined,
						synopsis: v.synopsis,
						version: v.version,
						romanized: v.romanized,
						updated_at: new Date()
					})
					.where(
						'comic_id',
						'=',
						sid.comicID ?? sid.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', sid.comicCode ?? '')
							: 0
					)
					.where('rid', '=', sid.rid);

				if (v.comicID || v.comicCode) {
					query = query.where(
						'comic_id',
						'!=',
						v.comicID ?? v.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', v.comicCode ?? '')
							: 0
					);
				}
				if (v.rid) query = query.where('rid', '!=', v.rid);
				if (v.languageID || v.languageIETF) {
					query = query.where(
						'language_id',
						'!=',
						v.languageID ?? v.languageIETF
							? (eb) =>
									eb
										.selectFrom('donoengine.language')
										.select('id')
										.where('ietf', '=', v.languageIETF ?? '')
							: 0
					);
				}
				if (v.synopsis) query = query.where('synopsis', '!=', v.synopsis);
				if (v.version !== undefined)
					query = query.where('version', 'is not distinct from', v.version);
				if (v.romanized !== undefined)
					query = query.where('romanized', 'is not distinct from', v.romanized);

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.language as b', 'b.id', 'a.language_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.language_id',
				'b.ietf as language_ietf',
				'a.synopsis',
				'a.version',
				'a.romanized'
			])
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				languageID: r.language_id,
				languageIETF: r.language_ietf,
				synopsis: r.synopsis,
				version: r.version,
				romanized: r.romanized
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICSYNOPSIS_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICSYNOPSIS_FKEY1:
							throw new GenericError('language does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICSYNOPSIS_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICSYNOPSIS_KEY1:
							throw new GenericError('same comic id + synopsis already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicSynopsisBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_synopsis')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicSynopsisBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_synopsis')
						.where(
							'comic_id',
							'=',
							sid.comicID ?? sid.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.comicCode ?? '')
								: 0
						)
						.where('rid', '=', sid.rid)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicSynopsis(db: DB, criteria: ParComicSynopsis): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_synopsis');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicExternalTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	comic_id: number;
	rid: string;
	website_id: number;
	relative_url: string | null;
	official: boolean | null;
}

const NAME_ERROR_COMICEXTERNAL_KEY0 = 'comic_external_comic_id_rid_key';
const NAME_ERROR_COMICEXTERNAL_KEY1 = 'comic_external_comic_id_website_id_relative_url_key';
const NAME_ERROR_COMICEXTERNAL_FKEY0 = 'comic_external_comic_id_fkey';
const NAME_ERROR_COMICEXTERNAL_FKEY1 = 'comic_external_website_id_fkey';

export async function insertComicExternal(db: DB, v: NewComicExternal): Promise<ComicExternal> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.comic_external')
					.values({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: 0,
						rid: v.rid,
						website_id:
							v.websiteID ?? v.websiteDomain
								? (eb) =>
										eb
											.selectFrom('donoengine.website')
											.select('id')
											.where('domain', '=', v.websiteDomain ?? '')
								: 0,
						relative_url: v.relativeURL,
						official: v.official
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.official'
			])
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			comicID: r.comic_id,
			rid: r.rid,
			websiteID: r.website_id,
			websiteDomain: r.website_domain,
			relativeURL: r.relative_url,
			official: r.official
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICEXTERNAL_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICEXTERNAL_FKEY1:
							throw new GenericError('website does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICEXTERNAL_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICEXTERNAL_KEY1:
							throw new GenericError('same comic id + website id + relative url already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicExternal(
	db: DB,
	criteria: ParComicExternal
): Promise<ComicExternal[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic_external as a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.official'
			]);

		if (criteria.comicIDs && criteria.comicIDs.length > 0)
			if (criteria.comicIDs.length == 1) {
				query = query.where('a.comic_id', '=', criteria.comicIDs[0]);
			} else {
				query = query.where('a.comic_id', 'in', criteria.comicIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'comic_id':
					case 'rid':
					case 'website_id':
					case 'website_domain':
					case 'relative_url':
					case 'official':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				websiteID: r.website_id,
				websiteDomain: r.website_domain,
				relativeURL: r.relative_url,
				official: r.official
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicExternalBySID(
	db: DB,
	sid: ComicGenericSID
): Promise<ComicExternal | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_external as a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.official'
			])
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				websiteID: r.website_id,
				websiteDomain: r.website_domain,
				relativeURL: r.relative_url,
				official: r.official
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicExternalBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicExternal
): Promise<ComicExternal | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.comic_external')
					.set({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: undefined,
						rid: v.rid,
						website_id:
							v.websiteID ?? v.websiteDomain
								? (eb) =>
										eb
											.selectFrom('donoengine.website')
											.select('id')
											.where('domain', '=', v.websiteDomain ?? '')
								: undefined,
						relative_url: v.relativeURL,
						official: v.official,
						updated_at: new Date()
					})
					.where(
						'comic_id',
						'=',
						sid.comicID ?? sid.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', sid.comicCode ?? '')
							: 0
					)
					.where('rid', '=', sid.rid);

				if (v.comicID || v.comicCode) {
					query = query.where(
						'comic_id',
						'!=',
						v.comicID ?? v.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', v.comicCode ?? '')
							: 0
					);
				}
				if (v.rid) query = query.where('rid', '!=', v.rid);
				if (v.websiteID || v.websiteDomain) {
					query = query.where(
						'website_id',
						'!=',
						v.websiteID ?? v.websiteDomain
							? (eb) =>
									eb
										.selectFrom('donoengine.website')
										.select('id')
										.where('domain', '=', v.websiteDomain ?? '')
							: 0
					);
				}
				if (v.relativeURL !== undefined)
					query = query.where('relative_url', 'is not distinct from', v.relativeURL);
				if (v.official !== undefined)
					query = query.where('official', 'is not distinct from', v.official);

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.website as b', 'b.id', 'a.website_id')
			.select([
				'a.id',
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.rid',
				'a.website_id',
				'b.domain as website_domain',
				'a.relative_url',
				'a.official'
			])
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				rid: r.rid,
				websiteID: r.website_id,
				websiteDomain: r.website_domain,
				relativeURL: r.relative_url,
				official: r.official
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICEXTERNAL_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICEXTERNAL_FKEY1:
							throw new GenericError('website does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					switch (e.constraint) {
						case NAME_ERROR_COMICEXTERNAL_KEY0:
							throw new GenericError('same comic id + rid already exists');
						case NAME_ERROR_COMICEXTERNAL_KEY1:
							throw new GenericError('same comic id + website id + relative url already exists');
					}
					break;
			}
		} */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicExternalBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_external')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('rid', '=', sid.rid)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicExternalBySID(db: DB, sid: ComicGenericSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_external')
						.where(
							'comic_id',
							'=',
							sid.comicID ?? sid.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.comicCode ?? '')
								: 0
						)
						.where('rid', '=', sid.rid)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicExternal(db: DB, criteria: ParComicExternal): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_external');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicCategoryTable {
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	comic_id: number;
	category_id: number;
}

const NAME_ERROR_COMICCATEGORY_PKEY = 'comic_category_pkey';
const NAME_ERROR_COMICCATEGORY_FKEY0 = 'comic_category_comic_id_fkey';
const NAME_ERROR_COMICCATEGORY_FKEY1 = 'comic_category_category_id_fkey';

export async function insertComicCategory(db: DB, v: NewComicCategory): Promise<ComicCategory> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.comic_category')
					.values({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: 0,
						category_id:
							v.categoryID ?? v.categoryCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												v.categoryTypeID ?? v.categoryTypeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', v.categoryTypeCode ?? '')
													: 0
											)
											.where('code', '=', v.categoryCode ?? '')
								: 0
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.category as b', 'b.id', 'a.category_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.category_id',
				'b.type_id as category_type_id',
				'b.code as category_code'
			])
			.executeTakeFirstOrThrow();

		return {
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			comicID: r.comic_id,
			categoryID: r.category_id,
			categoryTypeID: r.category_type_id,
			categoryCode: r.category_code
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICCATEGORY_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICCATEGORY_FKEY1:
							throw new GenericError('category does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICCATEGORY_PKEY) {
						throw new GenericError('same category id already exists');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicCategory(
	db: DB,
	criteria: ParComicCategory
): Promise<ComicCategory[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic_category as a')
			.innerJoin('donoengine.category as b', 'b.id', 'a.category_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.category_id',
				'b.type_id as category_type_id',
				'b.code as category_code'
			]);

		if (criteria.comicIDs && criteria.comicIDs.length > 0)
			if (criteria.comicIDs.length == 1) {
				query = query.where('a.comic_id', '=', criteria.comicIDs[0]);
			} else {
				query = query.where('a.comic_id', 'in', criteria.comicIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'created_at':
					case 'updated_at':
					case 'comic_id':
					case 'category_id':
					case 'category_type_id':
					case 'category_code':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				categoryID: r.category_id,
				categoryTypeID: r.category_type_id,
				categoryCode: r.category_code
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicCategoryBySID(
	db: DB,
	sid: ComicCategorySID
): Promise<ComicCategory | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_category as a')
			.innerJoin('donoengine.category as b', 'b.id', 'a.category_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.category_id',
				'b.type_id as category_type_id',
				'b.code as category_code'
			])
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where(
				'category_id',
				'=',
				sid.categoryID ?? sid.categorySID
					? (eb) =>
							eb
								.selectFrom('donoengine.category')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.categorySID?.typeID ?? sid.categorySID?.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.category_type')
													.select('id')
													.where('code', '=', sid.categorySID?.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.categorySID?.code ?? '')
					: 0
			)
			.executeTakeFirst();

		if (r)
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				categoryID: r.category_id,
				categoryTypeID: r.category_type_id,
				categoryCode: r.category_code
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicCategoryBySID(
	db: DB,
	sid: ComicCategorySID,
	v: SetComicCategory
): Promise<ComicCategory | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.comic_category')
					.set({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: undefined,
						category_id:
							v.categoryID ?? v.categoryCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												v.categoryTypeID ?? v.categoryTypeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', v.categoryTypeCode ?? '')
													: 0
											)
											.where('code', '=', v.categoryCode ?? '')
								: undefined,
						updated_at: new Date()
					})
					.where(
						'comic_id',
						'=',
						sid.comicID ?? sid.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', sid.comicCode ?? '')
							: 0
					)
					.where(
						'category_id',
						'=',
						sid.categoryID ?? sid.categorySID
							? (eb) =>
									eb
										.selectFrom('donoengine.category')
										.select('id')
										.where(
											'type_id',
											'=',
											sid.categorySID?.typeID ?? sid.categorySID?.typeCode
												? (eb) =>
														eb
															.selectFrom('donoengine.category_type')
															.select('id')
															.where('code', '=', sid.categorySID?.typeCode ?? '')
												: 0
										)
										.where('code', '=', sid.categorySID?.code ?? '')
							: 0
					);

				if (v.comicID || v.comicCode) {
					query = query.where(
						'comic_id',
						'!=',
						v.comicID ?? v.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', v.comicCode ?? '')
							: 0
					);
				}
				if (v.categoryID || v.categoryCode) {
					query = query.where(
						'category_id',
						'!=',
						v.categoryID ?? v.categoryCode
							? (eb) =>
									eb
										.selectFrom('donoengine.category')
										.select('id')
										.where(
											'type_id',
											'=',
											v.categoryTypeID ?? v.categoryTypeCode
												? (eb) =>
														eb
															.selectFrom('donoengine.category_type')
															.select('id')
															.where('code', '=', v.categoryTypeCode ?? '')
												: 0
										)
										.where('code', '=', v.categoryCode ?? '')
							: 0
					);
				}

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.category as b', 'b.id', 'a.category_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.category_id',
				'b.type_id as category_type_id',
				'b.code as category_code'
			])
			.executeTakeFirst();

		if (r)
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				categoryID: r.category_id,
				categoryTypeID: r.category_type_id,
				categoryCode: r.category_code
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICCATEGORY_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICCATEGORY_FKEY1:
							throw new GenericError('category does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICCATEGORY_PKEY) {
						throw new GenericError('same category id already exists');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicCategoryBySID(db: DB, sid: ComicCategorySID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_category')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where(
				'category_id',
				'=',
				sid.categoryID ?? sid.categorySID
					? (eb) =>
							eb
								.selectFrom('donoengine.category')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.categorySID?.typeID ?? sid.categorySID?.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.category_type')
													.select('id')
													.where('code', '=', sid.categorySID?.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.categorySID?.code ?? '')
					: 0
			)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicCategoryBySID(db: DB, sid: ComicCategorySID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_category')
						.where(
							'comic_id',
							'=',
							sid.comicID ?? sid.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.comicCode ?? '')
								: 0
						)
						.where(
							'category_id',
							'=',
							sid.categoryID ?? sid.categorySID
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												sid.categorySID?.typeID ?? sid.categorySID?.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', sid.categorySID?.typeCode ?? '')
													: 0
											)
											.where('code', '=', sid.categorySID?.code ?? '')
								: 0
						)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicCategory(db: DB, criteria: ParComicCategory): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_category');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicTagTable {
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	comic_id: number;
	tag_id: number;
}

const NAME_ERROR_COMICTAG_PKEY = 'comic_tag_pkey';
const NAME_ERROR_COMICTAG_FKEY0 = 'comic_tag_comic_id_fkey';
const NAME_ERROR_COMICTAG_FKEY1 = 'comic_tag_tag_id_fkey';

export async function insertComicTag(db: DB, v: NewComicTag): Promise<ComicTag> {
	try {
		const r = await db
			.with('a', (qc) =>
				qc
					.insertInto('donoengine.comic_tag')
					.values({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: 0,
						tag_id:
							v.tagID ?? v.tagCode
								? (eb) =>
										eb
											.selectFrom('donoengine.tag')
											.select('id')
											.where(
												'type_id',
												'=',
												v.tagTypeID ?? v.tagTypeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.tag_type')
																.select('id')
																.where('code', '=', v.tagTypeCode ?? '')
													: 0
											)
											.where('code', '=', v.tagCode ?? '')
								: 0
					})
					.returningAll()
			)
			.selectFrom('a')
			.innerJoin('donoengine.tag as b', 'b.id', 'a.tag_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.tag_id',
				'b.type_id as tag_type_id',
				'b.code as tag_code'
			])
			.executeTakeFirstOrThrow();

		return {
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			comicID: r.comic_id,
			tagID: r.tag_id,
			tagTypeID: r.tag_type_id,
			tagCode: r.tag_code
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICTAG_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICTAG_FKEY1:
							throw new GenericError('tag does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICTAG_PKEY) {
						throw new GenericError('same tag id already exists');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicTag(db: DB, criteria: ParComicTag): Promise<ComicTag[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic_tag as a')
			.innerJoin('donoengine.tag as b', 'b.id', 'a.tag_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.tag_id',
				'b.type_id as tag_type_id',
				'b.code as tag_code'
			]);

		if (criteria.comicIDs && criteria.comicIDs.length > 0)
			if (criteria.comicIDs.length == 1) {
				query = query.where('a.comic_id', '=', criteria.comicIDs[0]);
			} else {
				query = query.where('a.comic_id', 'in', criteria.comicIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'created_at':
					case 'updated_at':
					case 'comic_id':
					case 'tag_id':
					case 'tag_type_id':
					case 'tag_code':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				tagID: r.tag_id,
				tagTypeID: r.tag_type_id,
				tagCode: r.tag_code
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicTagBySID(db: DB, sid: ComicTagSID): Promise<ComicTag | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_tag as a')
			.innerJoin('donoengine.tag as b', 'b.id', 'a.tag_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.tag_id',
				'b.type_id as tag_type_id',
				'b.code as tag_code'
			])
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where(
				'tag_id',
				'=',
				sid.tagID ?? sid.tagSID
					? (eb) =>
							eb
								.selectFrom('donoengine.tag')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.tagSID?.typeID ?? sid.tagSID?.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.tag_type')
													.select('id')
													.where('code', '=', sid.tagSID?.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.tagSID?.code ?? '')
					: 0
			)
			.executeTakeFirst();

		if (r)
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				tagID: r.tag_id,
				tagTypeID: r.tag_type_id,
				tagCode: r.tag_code
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicTagBySID(
	db: DB,
	sid: ComicTagSID,
	v: SetComicTag
): Promise<ComicTag | undefined> {
	try {
		const r = await db
			.with('a', (qc) => {
				let query = qc
					.updateTable('donoengine.comic_tag')
					.set({
						comic_id:
							v.comicID ?? v.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.comicCode ?? '')
								: undefined,
						tag_id:
							v.tagID ?? v.tagCode
								? (eb) =>
										eb
											.selectFrom('donoengine.category')
											.select('id')
											.where(
												'type_id',
												'=',
												v.tagTypeID ?? v.tagTypeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', v.tagTypeCode ?? '')
													: 0
											)
											.where('code', '=', v.tagCode ?? '')
								: undefined,
						updated_at: new Date()
					})
					.where(
						'comic_id',
						'=',
						sid.comicID ?? sid.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', sid.comicCode ?? '')
							: 0
					)
					.where(
						'tag_id',
						'=',
						sid.tagID ?? sid.tagSID
							? (eb) =>
									eb
										.selectFrom('donoengine.tag')
										.select('id')
										.where(
											'type_id',
											'=',
											sid.tagSID?.typeID ?? sid.tagSID?.typeCode
												? (eb) =>
														eb
															.selectFrom('donoengine.tag_type')
															.select('id')
															.where('code', '=', sid.tagSID?.typeCode ?? '')
												: 0
										)
										.where('code', '=', sid.tagSID?.code ?? '')
							: 0
					);

				if (v.comicID || v.comicCode) {
					query = query.where(
						'comic_id',
						'!=',
						v.comicID ?? v.comicCode
							? (eb) =>
									eb
										.selectFrom('donoengine.comic')
										.select('id')
										.where('code', '=', v.comicCode ?? '')
							: 0
					);
				}
				if (v.tagID || v.tagCode) {
					query = query.where(
						'tag_id',
						'!=',
						v.tagID ?? v.tagCode
							? (eb) =>
									eb
										.selectFrom('donoengine.tag')
										.select('id')
										.where(
											'type_id',
											'=',
											v.tagTypeID ?? v.tagTypeCode
												? (eb) =>
														eb
															.selectFrom('donoengine.tag_type')
															.select('id')
															.where('code', '=', v.tagTypeCode ?? '')
												: 0
										)
										.where('code', '=', v.tagCode ?? '')
							: 0
					);
				}

				return query.returningAll();
			})
			.selectFrom('a')
			.innerJoin('donoengine.tag as b', 'b.id', 'a.tag_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.comic_id',
				'a.tag_id',
				'b.type_id as tag_type_id',
				'b.code as tag_code'
			])
			.executeTakeFirst();

		if (r)
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				tagID: r.tag_id,
				tagTypeID: r.tag_type_id,
				tagCode: r.tag_code
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICTAG_FKEY0:
							throw new GenericError('comic does not exist');
						case NAME_ERROR_COMICTAG_FKEY1:
							throw new GenericError('tag does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICTAG_PKEY) {
						throw new GenericError('same tag id already exists');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicTagBySID(db: DB, sid: ComicTagSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_tag')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where(
				'tag_id',
				'=',
				sid.tagID ?? sid.tagSID
					? (eb) =>
							eb
								.selectFrom('donoengine.tag')
								.select('id')
								.where(
									'type_id',
									'=',
									sid.tagSID?.typeID ?? sid.tagSID?.typeCode
										? (eb) =>
												eb
													.selectFrom('donoengine.category_type')
													.select('id')
													.where('code', '=', sid.tagSID?.typeCode ?? '')
										: 0
								)
								.where('code', '=', sid.tagSID?.code ?? '')
					: 0
			)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicTagBySID(db: DB, sid: ComicTagSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_tag')
						.where(
							'comic_id',
							'=',
							sid.comicID ?? sid.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.comicCode ?? '')
								: 0
						)
						.where(
							'tag_id',
							'=',
							sid.tagID ?? sid.tagSID
								? (eb) =>
										eb
											.selectFrom('donoengine.tag')
											.select('id')
											.where(
												'type_id',
												'=',
												sid.tagSID?.typeID ?? sid.tagSID?.typeCode
													? (eb) =>
															eb
																.selectFrom('donoengine.category_type')
																.select('id')
																.where('code', '=', sid.tagSID?.typeCode ?? '')
													: 0
											)
											.where('code', '=', sid.tagSID?.code ?? '')
								: 0
						)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicTag(db: DB, criteria: ParComicTag): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_tag');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicRelationTypeTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	code: string;
	name: string;
}

const NAME_ERROR_COMICRELATIONTYPE_KEY = 'comic_relation_type_code_key';

export async function insertComicRelationType(
	db: DB,
	v: NewComicRelationType
): Promise<ComicRelationType> {
	try {
		const r = await db
			.insertInto('donoengine.comic_relation_type')
			.values({
				code: v.code,
				name: v.name
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			code: r.code,
			name: r.name
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_COMICRELATIONTYPE_KEY) {
				throw new GenericError('same code already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicRelationType(
	db: DB,
	criteria: ParComicRelationType
): Promise<ComicRelationType[]> {
	try {
		let query = db.selectFrom('donoengine.comic_relation_type');

		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'code':
					case 'name':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.selectAll().execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicRelationTypeByCode(
	db: DB,
	code: string
): Promise<ComicRelationType | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_relation_type')
			.where('code', '=', code)
			.selectAll()
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicRelationTypeByCode(
	db: DB,
	code: string,
	v: SetComicRelationType
): Promise<ComicRelationType | undefined> {
	try {
		let query = db
			.updateTable('donoengine.comic_relation_type')
			.set({
				code: v.code,
				name: v.name,
				updated_at: new Date()
			})
			.where('code', '=', code);

		if (v.code) query = query.where('code', '!=', v.code);
		if (v.name) query = query.where('name', '!=', v.name);

		const r = await query.returningAll().executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				code: r.code,
				name: r.name
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			if (e.code == CODE_ERROR_EXISTS && e.constraint == NAME_ERROR_COMICRELATIONTYPE_KEY) {
				throw new GenericError('same code already exists');
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicRelationTypeByCode(db: DB, code: string): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_relation_type')
			.where('code', '=', code)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicRelationTypeByCode(db: DB, code: string): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_relation_type')
						.where('code', '=', code)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicRelationType(
	db: DB,
	criteria: ParComicRelationType
): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_relation_type');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicRelationTable {
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	type_id: number;
	parent_id: number;
	child_id: number;
}

const NAME_ERROR_COMICRELATION_PKEY = 'comic_relation_pkey';
const NAME_ERROR_COMICRELATION_FKEY0 = 'comic_relation_type_id_fkey';
const NAME_ERROR_COMICRELATION_FKEY1 = 'comic_relation_parent_id_fkey';
const NAME_ERROR_COMICRELATION_FKEY2 = 'comic_relation_child_id_fkey';
const NAME_ERROR_COMICRELATION_CHECK = 'comic_relation_parent_id_child_id_check';

export async function insertComicRelation(db: DB, v: NewComicRelation): Promise<ComicRelation> {
	try {
		const query = async function (qc: QueryCreator<Database>) {
			return await qc
				.with('a', (qc) =>
					qc
						.insertInto('donoengine.comic_relation')
						.values({
							type_id:
								v.typeID ?? v.typeCode
									? (eb) =>
											eb
												.selectFrom('donoengine.comic_relation_type')
												.select('id')
												.where('code', '=', v.typeCode ?? '')
									: 0,
							parent_id:
								v.parentID ?? v.parentCode
									? (eb) =>
											eb
												.selectFrom('donoengine.comic')
												.select('id')
												.where('code', '=', v.parentCode ?? '')
									: 0,
							child_id:
								v.childID ?? v.childCode
									? (eb) =>
											eb
												.selectFrom('donoengine.comic')
												.select('id')
												.where('code', '=', v.childCode ?? '')
									: 0
						})
						.returningAll()
				)
				.selectFrom('a')
				.innerJoin('donoengine.comic as b', 'b.id', 'a.child_id')
				.select([
					'a.created_at',
					'a.updated_at',
					'a.type_id',
					'a.parent_id',
					'a.child_id',
					'b.code as child_code'
				])
				.executeTakeFirstOrThrow();
		};

		return db.transaction().execute(async (tx) => {
			const r = await query(tx);

			if (
				await sql<boolean>`
				WITH RECURSIVE childs AS (
					SELECT child_id, parent_id
						FROM ${sql.table('donoengine.comic_relation')} WHERE type_id = ${r.type_id}
					UNION SELECT childs.child_id, parents.parent_id
						FROM ${sql.table('donoengine.comic_relation')} AS parents
					JOIN childs ON childs.parent_id = parents.child_id
				) SELECT (${r.parent_id}, ${r.child_id}) IN (SELECT * FROM childs)
				`
					.execute(tx)
					.then((v) => v.rows[0] ?? false)
			) {
				throw new GenericError('comic relation loop detected');
			}

			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				parentID: r.parent_id,
				childID: r.child_id,
				childCode: r.child_code
			};
		});
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICRELATION_FKEY0:
							throw new GenericError('comic relation type does not exist');
						case NAME_ERROR_COMICRELATION_FKEY1:
							throw new GenericError('parent comic does not exist');
						case NAME_ERROR_COMICRELATION_FKEY2:
							throw new GenericError('child comic does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICRELATION_PKEY) {
						throw new GenericError('same type id + child id already exists');
					}
					break;
				case CODE_ERROR_VALIDATION:
					if (e.constraint == NAME_ERROR_COMICRELATION_CHECK) {
						throw new GenericError('parent comic and child comic cannot be same');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicRelation(
	db: DB,
	criteria: ParComicRelation
): Promise<ComicRelation[]> {
	try {
		let query = db
			.selectFrom('donoengine.comic_relation as a')
			.innerJoin('donoengine.comic as b', 'b.id', 'a.child_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'a.parent_id',
				'a.child_id',
				'b.code as child_code'
			]);

		if (criteria.parentIDs && criteria.parentIDs.length > 0)
			if (criteria.parentIDs.length == 1) {
				query = query.where('a.parent_id', '=', criteria.parentIDs[0]);
			} else {
				query = query.where('a.parent_id', 'in', criteria.parentIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'created_at':
					case 'updated_at':
					case 'type_id':
					case 'parent_id':
					case 'child_id':
					case 'child_code':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset((criteria.limit ?? 0) * (criteria.page - 1));

		const r = await query.execute();

		return r.map((r) => {
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				parentID: r.parent_id,
				childID: r.child_id,
				childCode: r.child_code
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicRelationBySID(
	db: DB,
	sid: ComicRelationSID
): Promise<ComicRelation | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_relation as a')
			.innerJoin('donoengine.comic as b', 'b.id', 'a.child_id')
			.select([
				'a.created_at',
				'a.updated_at',
				'a.type_id',
				'a.parent_id',
				'a.child_id',
				'b.code as child_code'
			])
			.where(
				'type_id',
				'=',
				sid.typeID ?? sid.typeCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic_relation_type')
								.select('id')
								.where('code', '=', sid.typeCode ?? '')
					: 0
			)
			.where(
				'parent_id',
				'=',
				sid.parentID ?? sid.parentCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.parentCode ?? '')
					: 0
			)
			.where(
				'child_id',
				'=',
				sid.childID ?? sid.childCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.childCode ?? '')
					: 0
			)
			.executeTakeFirst();

		if (r)
			return {
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				typeID: r.type_id,
				parentID: r.parent_id,
				childID: r.child_id,
				childCode: r.child_code
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicRelationBySID(
	db: DB,
	sid: ComicRelationSID,
	v: SetComicRelation
): Promise<ComicRelation | undefined> {
	try {
		const query = async function (qc: QueryCreator<Database>) {
			return await qc
				.with('a', (qc) => {
					let query = qc
						.updateTable('donoengine.comic_relation')
						.set({
							type_id:
								v.typeID ?? v.typeCode
									? (eb) =>
											eb
												.selectFrom('donoengine.comic_relation_type')
												.select('id')
												.where('code', '=', v.typeCode ?? '')
									: undefined,
							parent_id:
								v.parentID ?? v.parentCode
									? (eb) =>
											eb
												.selectFrom('donoengine.comic')
												.select('id')
												.where('code', '=', v.parentCode ?? '')
									: undefined,
							child_id:
								v.childID ?? v.childCode
									? (eb) =>
											eb
												.selectFrom('donoengine.comic')
												.select('id')
												.where('code', '=', v.childCode ?? '')
									: undefined,
							updated_at: new Date()
						})
						.where(
							'type_id',
							'=',
							sid.typeID ?? sid.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic_relation_type')
											.select('id')
											.where('code', '=', sid.typeCode ?? '')
								: 0
						)
						.where(
							'parent_id',
							'=',
							sid.parentID ?? sid.parentCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.parentCode ?? '')
								: 0
						)
						.where(
							'child_id',
							'=',
							sid.childID ?? sid.childCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.childCode ?? '')
								: 0
						);

					if (v.typeID || v.typeCode) {
						query = query.where(
							'type_id',
							'!=',
							v.typeID ?? v.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic_relation_type')
											.select('id')
											.where('code', '=', v.typeCode ?? '')
								: 0
						);
					}
					if (v.parentID || v.parentCode) {
						query = query.where(
							'parent_id',
							'!=',
							v.parentID ?? v.parentCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.parentCode ?? '')
								: 0
						);
					}
					if (v.childID || v.childCode) {
						query = query.where(
							'child_id',
							'!=',
							v.childID ?? v.childCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', v.childCode ?? '')
								: 0
						);
					}

					return query.returningAll();
				})
				.selectFrom('a')
				.innerJoin('donoengine.comic as b', 'b.id', 'a.child_id')
				.select([
					'a.created_at',
					'a.updated_at',
					'a.type_id',
					'a.parent_id',
					'a.child_id',
					'b.code as child_code'
				])
				.executeTakeFirst();
		};

		return db.transaction().execute(async (tx) => {
			const r = await query(tx);

			if (r) {
				if (
					await sql<boolean>`
				WITH RECURSIVE childs AS (
					SELECT child_id, parent_id
						FROM ${sql.table('donoengine.comic_relation')} WHERE type_id = ${r.type_id}
					UNION SELECT childs.child_id, parents.parent_id
						FROM ${sql.table('donoengine.comic_relation')} AS parents
					JOIN childs ON childs.parent_id = parents.child_id
				) SELECT (${r.parent_id}, ${r.child_id}) IN (SELECT * FROM childs)
				`
						.execute(tx)
						.then((v) => v.rows[0] ?? false)
				) {
					throw new GenericError('comic relation loop detected');
				}

				return {
					createdAt: r.created_at,
					updatedAt: r.updated_at,
					typeID: r.type_id,
					parentID: r.parent_id,
					childID: r.child_id,
					childCode: r.child_code
				};
			}
		});
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					switch (e.constraint) {
						case NAME_ERROR_COMICRELATION_FKEY0:
							throw new GenericError('comic relation type does not exist');
						case NAME_ERROR_COMICRELATION_FKEY1:
							throw new GenericError('parent comic does not exist');
						case NAME_ERROR_COMICRELATION_FKEY2:
							throw new GenericError('child comic does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICRELATION_PKEY) {
						throw new GenericError('same type id + child id already exists');
					}
					break;
				case CODE_ERROR_VALIDATION:
					if (e.constraint == NAME_ERROR_COMICRELATION_CHECK) {
						throw new GenericError('parent comic and child comic cannot be same');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicRelationBySID(db: DB, sid: ComicRelationSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_relation')
			.where(
				'type_id',
				'=',
				sid.typeID ?? sid.typeCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic_relation_type')
								.select('id')
								.where('code', '=', sid.typeCode ?? '')
					: 0
			)
			.where(
				'parent_id',
				'=',
				sid.parentID ?? sid.parentCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.parentCode ?? '')
					: 0
			)
			.where(
				'child_id',
				'=',
				sid.childID ?? sid.childCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.childCode ?? '')
					: 0
			)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicRelationBySID(db: DB, sid: ComicRelationSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_relation')
						.where(
							'type_id',
							'=',
							sid.typeID ?? sid.typeCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic_relation_type')
											.select('id')
											.where('code', '=', sid.typeCode ?? '')
								: 0
						)
						.where(
							'parent_id',
							'=',
							sid.parentID ?? sid.parentCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.parentCode ?? '')
								: 0
						)
						.where(
							'child_id',
							'=',
							sid.childID ?? sid.childCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.childCode ?? '')
								: 0
						)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicRelation(db: DB, criteria: ParComicRelation): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_relation');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

interface ComicChapterTable {
	id: Generated<number>;
	created_at: ColumnType<Date, Date | undefined, never>;
	updated_at: ColumnType<Date | null, Date | undefined, Date | null>;
	comic_id: number;
	chapter: string;
	version: string | null;
	volume: string | null;
	released_at: ColumnType<Date | null, Date | undefined, Date | null>;
}

const NAME_ERROR_COMICCHAPTER_KEY = 'comic_chapter_comic_id_chapter_version_key';
const NAME_ERROR_COMICCHAPTER_FKEY = 'comic_chapter_comic_id_fkey';

export async function insertComicChapter(db: DB, v: NewComicChapter): Promise<ComicChapter> {
	try {
		const r = await db
			.insertInto('donoengine.comic_chapter')
			.values({
				comic_id:
					v.comicID ?? v.comicCode
						? (eb) =>
								eb
									.selectFrom('donoengine.comic')
									.select('id')
									.where('code', '=', v.comicCode ?? '')
						: 0,
				chapter: v.chapter,
				version: v.version,
				volume: v.volume,
				released_at: v.releasedAt
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return {
			id: r.id,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
			comicID: r.comic_id,
			chapter: r.chapter,
			version: r.version,
			volume: r.volume,
			releasedAt: r.released_at
		};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_COMICCHAPTER_FKEY) {
						throw new GenericError('comic does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICCHAPTER_KEY) {
						throw new GenericError('same comic id + chapter + version already exists');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicChapter(
	db: DB,
	criteria: ParComicChapter
): Promise<ComicChapter[]> {
	try {
		let query = db.selectFrom('donoengine.comic_chapter');

		if (criteria.comicIDs && criteria.comicIDs.length > 0)
			if (criteria.comicIDs.length == 1) {
				query = query.where('comic_id', '=', criteria.comicIDs[0]);
			} else {
				query = query.where('comic_id', 'in', criteria.comicIDs);
			}
		if (criteria.orderBys)
			criteria.orderBys.forEach((ob) => {
				let direction = '';
				switch (ob.sort?.toLocaleLowerCase()) {
					case 'a':
					case 'asc':
					case 'ascend':
					case 'ascending':
						direction += 'asc';
						break;
					case 'd':
					case 'desc':
					case 'descend':
					case 'descending':
						direction += 'desc';
						break;
				}
				switch (ob.null?.toLocaleLowerCase()) {
					case 'f':
					case 'first':
						if (direction) direction += ' ';
						direction += 'nulls first';
						break;
					case 'l':
					case 'last':
						if (direction) direction += ' ';
						direction += 'nulls last';
						break;
				}
				const name = ob.name.toLowerCase();
				switch (name) {
					case 'id':
					case 'created_at':
					case 'updated_at':
					case 'comic_id':
					case 'chapter':
					case 'version':
					case 'volume':
					case 'released_at':
						query = query.orderBy(name, direction ? sql.raw(direction) : undefined);
						break;
				}
			});
		if (criteria.limit) query = query.limit(criteria.limit);
		if (criteria.page) query = query.offset(criteria.limit ?? 0 * (criteria.page - 1));

		const r = await query.selectAll().execute();

		return r.map((r) => {
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				chapter: r.chapter,
				version: r.version,
				volume: r.volume,
				releasedAt: r.released_at
			};
		});
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function selectComicChapterBySID(
	db: DB,
	sid: ComicChapterSID
): Promise<ComicChapter | undefined> {
	try {
		const r = await db
			.selectFrom('donoengine.comic_chapter')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('chapter', '=', sid.chapter)
			.where('version', 'is distinct from', sid.version)
			.selectAll()
			.executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				chapter: r.chapter,
				version: r.version,
				volume: r.volume,
				releasedAt: r.released_at
			};
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function updateComicChapterBySID(
	db: DB,
	sid: ComicChapterSID,
	v: SetComicChapter
): Promise<ComicChapter | undefined> {
	try {
		let query = db
			.updateTable('donoengine.comic_chapter')
			.set({
				comic_id:
					v.comicID ?? v.comicCode
						? (eb) =>
								eb
									.selectFrom('donoengine.comic')
									.select('id')
									.where('code', '=', v.comicCode ?? '')
						: undefined,
				chapter: v.chapter,
				version: v.version,
				volume: v.volume,
				released_at: v.releasedAt,
				updated_at: new Date()
			})
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('chapter', '=', sid.chapter)
			.where('version', 'is distinct from', sid.version);

		if (v.comicID || v.comicCode) {
			query = query.where(
				'comic_id',
				'!=',
				v.comicID ?? v.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', v.comicCode ?? '')
					: 0
			);
		}
		if (v.chapter) query = query.where('chapter', '!=', v.chapter);
		if (v.version !== undefined) query = query.where('version', 'is not distinct from', v.version);
		if (v.volume !== undefined) query = query.where('volume', 'is not distinct from', v.volume);
		if (v.releasedAt !== undefined)
			query = query.where('released_at', 'is not distinct from', v.releasedAt);

		const r = await query.returningAll().executeTakeFirst();

		if (r)
			return {
				id: r.id,
				createdAt: r.created_at,
				updatedAt: r.updated_at,
				comicID: r.comic_id,
				chapter: r.chapter,
				version: r.version,
				volume: r.volume,
				releasedAt: r.released_at
			};
	} catch (e) {
		/* if (e instanceof pg.DatabaseError) {
			switch (e.code) {
				case CODE_ERROR_FOREIGN:
					if (e.constraint == NAME_ERROR_COMICCHAPTER_FKEY) {
						throw new GenericError('comic does not exist');
					}
					break;
				case CODE_ERROR_EXISTS:
					if (e.constraint == NAME_ERROR_COMICCHAPTER_KEY) {
						throw new GenericError('same comic id + chapter + version already exists');
					}
					break;
			}
		}  */
		databaseCatch(e);
		throw e;
	}
}

export async function deleteComicChapterBySID(db: DB, sid: ComicChapterSID): Promise<boolean> {
	try {
		const r = await db
			.deleteFrom('donoengine.comic_chapter')
			.where(
				'comic_id',
				'=',
				sid.comicID ?? sid.comicCode
					? (eb) =>
							eb
								.selectFrom('donoengine.comic')
								.select('id')
								.where('code', '=', sid.comicCode ?? '')
					: 0
			)
			.where('chapter', '=', sid.chapter)
			.where('version', 'is distinct from', sid.version)
			.executeTakeFirst();

		return r.numDeletedRows > 0;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function existsComicChapterBySID(db: DB, sid: ComicChapterSID): Promise<boolean> {
	try {
		const { exists } = await db
			.selectNoFrom(({ exists, selectFrom }) =>
				exists(
					selectFrom('donoengine.comic_chapter')
						.where(
							'comic_id',
							'=',
							sid.comicID ?? sid.comicCode
								? (eb) =>
										eb
											.selectFrom('donoengine.comic')
											.select('id')
											.where('code', '=', sid.comicCode ?? '')
								: 0
						)
						.where('chapter', '=', sid.chapter)
						.where('version', 'is distinct from', sid.version)
						.select(sql`1` as any)
				).as('exists')
			)
			.executeTakeFirstOrThrow();

		return Boolean(exists);
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}

export async function countComicChapter(db: DB, criteria: ParComicChapter): Promise<number> {
	try {
		let query = db.selectFrom('donoengine.comic_chapter');

		const { count } = await query
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.executeTakeFirstOrThrow();

		return count;
	} catch (e) {
		databaseCatch(e);
		throw e;
	}
}
