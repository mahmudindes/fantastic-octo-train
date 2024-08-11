import {
	insertLanguage,
	selectLanguage,
	selectLanguageByIETF,
	updateLanguageByIETF as dbupdateLanguageByIETF,
	deleteLanguageByIETF as dbdeleteLanguageByIETF,
	existsLanguageByIETF as dbexistsLanguageByIETF,
	countLanguage as dbcountLanguage,
	insertWebsite,
	selectWebsite,
	selectWebsiteByDomain,
	updateWebsiteByDomain as dbupdateWebsiteByDomain,
	deleteWebsiteByDomain as dbdeleteWebsiteByDomain,
	existsWebsiteByDomain as dbexistsWebsiteByDomain,
	countWebsite as dbcountWebsite,
	insertCategoryType,
	selectCategoryType,
	selectCategoryTypeByCode,
	updateCategoryTypeByCode as dbupdateCategoryTypeByCode,
	deleteCategoryTypeByCode as dbdeleteCategoryTypeByCode,
	existsCategoryTypeByCode as dbexistsCategoryTypeByCode,
	countCategoryType as dbcountCategoryType,
	insertCategory,
	selectCategory,
	selectCategoryBySID,
	updateCategoryBySID as dbupdateCategoryBySID,
	deleteCategoryBySID as dbdeleteCategoryBySID,
	existsCategoryBySID as dbexistsCategoryBySID,
	countCategory as dbcountCategory,
	insertCategoryRelation,
	selectCategoryRelation,
	selectCategoryRelationBySID,
	updateCategoryRelationBySID as dbupdateCategoryRelationBySID,
	deleteCategoryRelationBySID as dbdeleteCategoryRelationBySID,
	existsCategoryRelationBySID as dbexistsCategoryRelationBySID,
	countCategoryRelation as dbcountCategoryRelation,
	insertTagType,
	selectTagType,
	selectTagTypeByCode,
	updateTagTypeByCode as dbupdateTagTypeByCode,
	deleteTagTypeByCode as dbdeleteTagTypeByCode,
	existsTagTypeByCode as dbexistsTagTypeByCode,
	countTagType as dbcountTagType,
	insertTag,
	selectTag,
	selectTagBySID,
	updateTagBySID as dbupdateTagBySID,
	deleteTagBySID as dbdeleteTagBySID,
	existsTagBySID as dbexistsTagBySID,
	countTag as dbcountTag,
	insertComic,
	selectComic,
	selectComicByCode,
	updateComicByCode as dbupdateComicByCode,
	deleteComicByCode as dbdeleteComicByCode,
	existsComicByCode as dbexistsComicByCode,
	countComic as dbcountComic,
	insertComicTitle,
	selectComicTitle,
	selectComicTitleBySID,
	updateComicTitleBySID as dbupdateComicTitleBySID,
	deleteComicTitleBySID as dbdeleteComicTitleBySID,
	existsComicTitleBySID as dbexistsComicTitleBySID,
	countComicTitle as dbcountComicTitle,
	insertComicCover,
	selectComicCover,
	selectComicCoverBySID,
	updateComicCoverBySID as dbupdateComicCoverBySID,
	deleteComicCoverBySID as dbdeleteComicCoverBySID,
	existsComicCoverBySID as dbexistsComicCoverBySID,
	countComicCover as dbcountComicCover,
	insertComicSynopsis,
	selectComicSynopsis,
	selectComicSynopsisBySID,
	updateComicSynopsisBySID as dbupdateComicSynopsisBySID,
	deleteComicSynopsisBySID as dbdeleteComicSynopsisBySID,
	existsComicSynopsisBySID as dbexistsComicSynopsisBySID,
	countComicSynopsis as dbcountComicSynopsis,
	insertComicExternal,
	selectComicExternal,
	selectComicExternalBySID,
	updateComicExternalBySID as dbupdateComicExternalBySID,
	deleteComicExternalBySID as dbdeleteComicExternalBySID,
	existsComicExternalBySID as dbexistsComicExternalBySID,
	countComicExternal as dbcountComicExternal,
	insertComicCategory,
	selectComicCategory,
	selectComicCategoryBySID,
	updateComicCategoryBySID as dbupdateComicCategoryBySID,
	deleteComicCategoryBySID as dbdeleteComicCategoryBySID,
	existsComicCategoryBySID as dbexistsComicCategoryBySID,
	countComicCategory as dbcountComicCategory,
	insertComicTag,
	selectComicTag,
	selectComicTagBySID,
	updateComicTagBySID as dbupdateComicTagBySID,
	deleteComicTagBySID as dbdeleteComicTagBySID,
	existsComicTagBySID as dbexistsComicTagBySID,
	countComicTag as dbcountComicTag,
	insertComicRelationType,
	selectComicRelationType,
	selectComicRelationTypeByCode,
	updateComicRelationTypeByCode as dbupdateComicRelationTypeByCode,
	deleteComicRelationTypeByCode as dbdeleteComicRelationTypeByCode,
	existsComicRelationTypeByCode as dbexistsComicRelationTypeByCode,
	countComicRelationType as dbcountComicRelationType,
	insertComicRelation,
	selectComicRelation,
	selectComicRelationBySID,
	updateComicRelationBySID as dbupdateComicRelationBySID,
	deleteComicRelationBySID as dbdeleteComicRelationBySID,
	existsComicRelationBySID as dbexistsComicRelationBySID,
	countComicRelation as dbcountComicRelation,
	insertComicChapter,
	selectComicChapter,
	selectComicChapterBySID,
	updateComicChapterBySID as dbupdateComicChapterBySID,
	deleteComicChapterBySID as dbdeleteComicChapterBySID,
	existsComicChapterBySID as dbexistsComicChapterBySID,
	countComicChapter as dbcountComicChapter
} from './database';
import type { DB } from './database';
import { NotFoundError, PermissionError } from './model';
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
	SetCategory,
	CategorySID,
	ParCategory,
	CategoryRelation,
	NewCategoryRelation,
	SetCategoryRelation,
	CategoryRelationSID,
	ParCategoryRelation,
	TagType,
	NewTagType,
	SetTagType,
	ParTagType,
	Tag,
	NewTag,
	SetTag,
	TagSID,
	ParTag,
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
	SetComicCover,
	ParComicCover,
	ComicSynopsis,
	NewComicSynopsis,
	SetComicSynopsis,
	ParComicSynopsis,
	ComicExternal,
	NewComicExternal,
	SetComicExternal,
	ParComicExternal,
	ComicCategory,
	NewComicCategory,
	SetComicCategory,
	ComicCategorySID,
	ParComicCategory,
	ComicTag,
	NewComicTag,
	SetComicTag,
	ComicTagSID,
	ParComicTag,
	ComicRelationType,
	NewComicRelationType,
	SetComicRelationType,
	ParComicRelationType,
	ComicRelation,
	NewComicRelation,
	SetComicRelation,
	ComicRelationSID,
	ParComicRelation,
	ComicChapter,
	NewComicChapter,
	SetComicChapter,
	ComicChapterSID,
	ParComicChapter
} from './model';
import { tokenPermissionKey } from './auth';
import type { AccessToken } from './auth';

export async function addLanguage(db: DB, v: NewLanguage, a?: AccessToken): Promise<Language> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add language');
	}

	return await insertLanguage(db, v);
}

export async function getLanguageByIETF(db: DB, ietf: string): Promise<Language> {
	const r = await selectLanguageByIETF(db, ietf);

	if (!r) throw new NotFoundError('language does not exist');

	return r;
}

export async function updateLanguageByIETF(
	db: DB,
	ietf: string,
	v: SetLanguage,
	a?: AccessToken
): Promise<Language | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update language');
	}

	if (!(await dbexistsLanguageByIETF(db, ietf))) {
		throw new NotFoundError('language does not exist');
	}

	return await dbupdateLanguageByIETF(db, ietf, v);
}

export async function deleteLanguageByIETF(db: DB, ietf: string, a?: AccessToken): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete language');
	}

	if (!(await dbdeleteLanguageByIETF(db, ietf))) {
		throw new NotFoundError('language does not exist');
	}
}

export async function listLanguage(db: DB, params: ParLanguage): Promise<Language[]> {
	return await selectLanguage(db, params);
}

export async function countLanguage(db: DB, params: ParLanguage): Promise<number> {
	return await dbcountLanguage(db, params);
}

export async function addWebsite(db: DB, v: NewWebsite, a?: AccessToken): Promise<Website> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add website');
	}

	return await insertWebsite(db, v);
}

export async function getWebsiteByDomain(db: DB, domain: string): Promise<Website> {
	const r = await selectWebsiteByDomain(db, domain);

	if (!r) throw new NotFoundError('website does not exist');

	return r;
}

export async function updateWebsiteByDomain(
	db: DB,
	domain: string,
	v: SetWebsite,
	a?: AccessToken
): Promise<Website | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update website');
	}

	if (!(await dbexistsWebsiteByDomain(db, domain))) {
		throw new NotFoundError('website does not exist');
	}

	return await dbupdateWebsiteByDomain(db, domain, v);
}

export async function deleteWebsiteByDomain(
	db: DB,
	domain: string,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete website');
	}

	if (!(await dbdeleteWebsiteByDomain(db, domain))) {
		throw new NotFoundError('website does not exist');
	}
}

export async function listWebsite(db: DB, params: ParWebsite): Promise<Website[]> {
	return await selectWebsite(db, params);
}

export async function countWebsite(db: DB, params: ParWebsite): Promise<number> {
	return await dbcountWebsite(db, params);
}

export async function addCategoryType(
	db: DB,
	v: NewCategoryType,
	a?: AccessToken
): Promise<CategoryType> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add category type');
	}

	return await insertCategoryType(db, v);
}

export async function getCategoryTypeByCode(db: DB, code: string): Promise<CategoryType> {
	const r = await selectCategoryTypeByCode(db, code);

	if (!r) throw new NotFoundError('category type does not exist');

	return r;
}

export async function updateCategoryTypeByCode(
	db: DB,
	code: string,
	v: SetCategoryType,
	a?: AccessToken
): Promise<CategoryType | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update category type');
	}

	if (!(await dbexistsCategoryTypeByCode(db, code))) {
		throw new NotFoundError('category type does not exist');
	}

	return await dbupdateCategoryTypeByCode(db, code, v);
}

export async function deleteCategoryTypeByCode(
	db: DB,
	code: string,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete category type');
	}

	if (!(await dbdeleteCategoryTypeByCode(db, code))) {
		throw new NotFoundError('category type does not exist');
	}
}

export async function listCategoryType(db: DB, params: ParCategoryType): Promise<CategoryType[]> {
	return await selectCategoryType(db, params);
}

export async function countCategoryType(db: DB, params: ParCategoryType): Promise<number> {
	return await dbcountCategoryType(db, params);
}

export async function addCategory(db: DB, v: NewCategory, a?: AccessToken): Promise<Category> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add category');
	}

	return await insertCategory(db, v);
}

export async function getCategoryBySID(db: DB, sid: CategorySID): Promise<Category> {
	const r = await selectCategoryBySID(db, sid);

	if (!r) throw new NotFoundError('category does not exist');

	return r;
}

export async function updateCategoryBySID(
	db: DB,
	sid: CategorySID,
	v: SetCategory,
	a?: AccessToken
): Promise<Category | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update category');
	}

	if (!(await dbexistsCategoryBySID(db, sid))) {
		throw new NotFoundError('category does not exist');
	}

	return await dbupdateCategoryBySID(db, sid, v);
}

export async function deleteCategoryBySID(
	db: DB,
	sid: CategorySID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete category');
	}

	if (!(await dbdeleteCategoryBySID(db, sid))) {
		throw new NotFoundError('category does not exist');
	}
}

export async function listCategory(db: DB, params: ParCategory): Promise<Category[]> {
	return await selectCategory(db, params);
}

export async function countCategory(db: DB, params: ParCategory): Promise<number> {
	return await dbcountCategory(db, params);
}

export async function addCategoryRelation(
	db: DB,
	v: NewCategoryRelation,
	a?: AccessToken
): Promise<CategoryRelation> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add category relation');
	}

	return await insertCategoryRelation(db, v);
}

export async function getCategoryRelationBySID(
	db: DB,
	sid: CategoryRelationSID
): Promise<CategoryRelation> {
	const r = await selectCategoryRelationBySID(db, sid);

	if (!r) throw new NotFoundError('category relation does not exist');

	return r;
}

export async function updateCategoryRelationBySID(
	db: DB,
	sid: CategoryRelationSID,
	v: SetCategoryRelation,
	a?: AccessToken
): Promise<CategoryRelation | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update category relation');
	}

	if (!(await dbexistsCategoryRelationBySID(db, sid))) {
		throw new NotFoundError('category relation does not exist');
	}

	return await dbupdateCategoryRelationBySID(db, sid, v);
}

export async function deleteCategoryRelationBySID(
	db: DB,
	sid: CategoryRelationSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete category relation');
	}

	if (!(await dbdeleteCategoryRelationBySID(db, sid))) {
		throw new NotFoundError('category relation does not exist');
	}
}

export async function listCategoryRelation(
	db: DB,
	params: ParCategoryRelation
): Promise<CategoryRelation[]> {
	return await selectCategoryRelation(db, params);
}

export async function countCategoryRelation(db: DB, params: ParCategoryRelation): Promise<number> {
	return await dbcountCategoryRelation(db, params);
}

export async function addTagType(db: DB, v: NewTagType, a?: AccessToken): Promise<TagType> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add tag type');
	}

	return await insertTagType(db, v);
}

export async function getTagTypeByCode(db: DB, code: string): Promise<TagType> {
	const r = await selectTagTypeByCode(db, code);

	if (!r) throw new NotFoundError('tag type does not exist');

	return r;
}

export async function updateTagTypeByCode(
	db: DB,
	code: string,
	v: SetTagType,
	a?: AccessToken
): Promise<TagType | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update tag type');
	}

	if (!(await dbexistsTagTypeByCode(db, code))) {
		throw new NotFoundError('tag type does not exist');
	}

	return await dbupdateTagTypeByCode(db, code, v);
}

export async function deleteTagTypeByCode(db: DB, code: string, a?: AccessToken): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete tag type');
	}

	if (!(await dbdeleteTagTypeByCode(db, code))) {
		throw new NotFoundError('tag type does not exist');
	}
}

export async function listTagType(db: DB, params: ParTagType): Promise<TagType[]> {
	return await selectTagType(db, params);
}

export async function countTagType(db: DB, params: ParTagType): Promise<number> {
	return await dbcountTagType(db, params);
}

export async function addTag(db: DB, v: NewTag, a?: AccessToken): Promise<Tag> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add tag');
	}

	return await insertTag(db, v);
}

export async function getTagBySID(db: DB, sid: TagSID): Promise<Tag> {
	const r = await selectTagBySID(db, sid);

	if (!r) throw new NotFoundError('tag does not exist');

	return r;
}

export async function updateTagBySID(
	db: DB,
	sid: TagSID,
	v: SetTag,
	a?: AccessToken
): Promise<Tag | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update tag');
	}

	if (!(await dbexistsTagBySID(db, sid))) {
		throw new NotFoundError('tag does not exist');
	}

	return await dbupdateTagBySID(db, sid, v);
}

export async function deleteTagBySID(db: DB, sid: TagSID, a?: AccessToken): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete tag');
	}

	if (!(await dbdeleteTagBySID(db, sid))) {
		throw new NotFoundError('tag does not exist');
	}
}

export async function listTag(db: DB, params: ParTag): Promise<Tag[]> {
	return await selectTag(db, params);
}

export async function countTag(db: DB, params: ParTag): Promise<number> {
	return await dbcountTag(db, params);
}

export async function addComic(db: DB, v: NewComic, a?: AccessToken): Promise<Comic> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic');
	}

	const r: Comic = await insertComic(db, v);

	r.titles = [];
	r.covers = [];
	r.synopses = [];
	r.externals = [];
	r.categories = [];
	r.tags = [];
	r.relations = [];
	r.chapters = [];

	return r;
}

export async function getComicByCode(db: DB, code: string): Promise<Comic> {
	const r: Comic | undefined = await selectComicByCode(db, code);

	if (r) {
		r.titles = await listComicTitle(db, { comicIDs: [r.id] });
		r.covers = await listComicCover(db, { comicIDs: [r.id] });
		r.synopses = await listComicSynopsis(db, { comicIDs: [r.id] });
		r.externals = await listComicExternal(db, { comicIDs: [r.id] });
		r.categories = await listComicCategory(db, { comicIDs: [r.id] });
		r.tags = await listComicTag(db, { comicIDs: [r.id] });
		r.relations = await listComicRelation(db, { parentIDs: [r.id] });
		r.chapters = await listComicChapter(db, { comicIDs: [r.id] });
	} else {
		throw new NotFoundError('comic does not exist');
	}

	return r;
}

export async function updateComicByCode(
	db: DB,
	code: string,
	v: SetComic,
	a?: AccessToken
): Promise<Comic | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic');
	}

	if (!(await dbexistsComicByCode(db, code))) {
		throw new NotFoundError('comic does not exist');
	}

	const r: Comic | undefined = await dbupdateComicByCode(db, code, v);

	if (r) {
		r.titles = await listComicTitle(db, { comicIDs: [r.id] });
		r.covers = await listComicCover(db, { comicIDs: [r.id] });
		r.synopses = await listComicSynopsis(db, { comicIDs: [r.id] });
		r.externals = await listComicExternal(db, { comicIDs: [r.id] });
		r.categories = await listComicCategory(db, { comicIDs: [r.id] });
		r.tags = await listComicTag(db, { comicIDs: [r.id] });
		r.relations = await listComicRelation(db, { parentIDs: [r.id] });
		r.chapters = await listComicChapter(db, { comicIDs: [r.id] });
	}

	return r;
}

export async function deleteComicByCode(db: DB, code: string, a?: AccessToken): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic');
	}

	if (!(await dbdeleteComicByCode(db, code))) {
		throw new NotFoundError('comic does not exist');
	}
}

export async function listComic(db: DB, params: ParComic): Promise<Comic[]> {
	const r: Comic[] = await selectComic(db, params);

	if (r.length > 0) {
		r.forEach((r) => {
			r.titles = [];
			r.covers = [];
			r.synopses = [];
			r.externals = [];
			r.categories = [];
			r.tags = [];
			r.relations = [];
			r.chapters = [];
		});

		const comicIDs = r.map((comic) => comic.id);

		const titles = await listComicTitle(db, { comicIDs });
		titles.forEach((title) => {
			r.forEach((r) => {
				if (r.id == title.comicID) r.titles?.push(title);
			});
		});
		const covers = await listComicCover(db, { comicIDs });
		covers.forEach((cover) => {
			r.forEach((r) => {
				if (r.id == cover.comicID) r.covers?.push(cover);
			});
		});
		const synopses = await listComicSynopsis(db, { comicIDs });
		synopses.forEach((synopsis) => {
			r.forEach((r) => {
				if (r.id == synopsis.comicID) r.synopses?.push(synopsis);
			});
		});
		const externals = await listComicExternal(db, { comicIDs });
		externals.forEach((external) => {
			r.forEach((r) => {
				if (r.id == external.comicID) r.externals?.push(external);
			});
		});
		const categories = await listComicCategory(db, { comicIDs });
		categories.forEach((category) => {
			r.forEach((r) => {
				if (r.id == category.comicID) r.categories?.push(category);
			});
		});
		const tags = await listComicTag(db, { comicIDs });
		tags.forEach((tag) => {
			r.forEach((r) => {
				if (r.id == tag.comicID) r.tags?.push(tag);
			});
		});
		const relations = await listComicRelation(db, { parentIDs: comicIDs });
		relations.forEach((relation) => {
			r.forEach((r) => {
				if (r.id == relation.parentID) r.relations?.push(relation);
			});
		});
		const chapters = await listComicChapter(db, { comicIDs });
		chapters.forEach((chapter) => {
			r.forEach((r) => {
				if (r.id == chapter.comicID) r.chapters?.push(chapter);
			});
		});
	}

	return r;
}

export async function countComic(db: DB, params: ParComic): Promise<number> {
	return await dbcountComic(db, params);
}

export async function addComicTitle(
	db: DB,
	v: NewComicTitle,
	a?: AccessToken
): Promise<ComicTitle> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic title');
	}

	return await insertComicTitle(db, v);
}

export async function getComicTitleBySID(db: DB, sid: ComicGenericSID): Promise<ComicTitle> {
	const r = await selectComicTitleBySID(db, sid);

	if (!r) throw new NotFoundError('comic title does not exist');

	return r;
}

export async function updateComicTitleBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicTitle,
	a?: AccessToken
): Promise<ComicTitle | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic title');
	}

	if (!(await dbexistsComicTitleBySID(db, sid))) {
		throw new NotFoundError('comic title does not exist');
	}

	return await dbupdateComicTitleBySID(db, sid, v);
}

export async function deleteComicTitleBySID(
	db: DB,
	sid: ComicGenericSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic title');
	}

	if (!(await dbdeleteComicTitleBySID(db, sid))) {
		throw new NotFoundError('comic title does not exist');
	}
}

export async function listComicTitle(db: DB, params: ParComicTitle): Promise<ComicTitle[]> {
	return await selectComicTitle(db, params);
}

export async function countComicTitle(db: DB, params: ParComicTitle): Promise<number> {
	return await dbcountComicTitle(db, params);
}

export async function addComicCover(
	db: DB,
	v: NewComicCover,
	a?: AccessToken
): Promise<ComicCover> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic cover');
	}

	return await insertComicCover(db, v);
}

export async function getComicCoverBySID(db: DB, sid: ComicGenericSID): Promise<ComicCover> {
	const r = await selectComicCoverBySID(db, sid);

	if (!r) throw new NotFoundError('comic cover does not exist');

	return r;
}

export async function updateComicCoverBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicCover,
	a?: AccessToken
): Promise<ComicCover | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic cover');
	}

	if (!(await dbexistsComicCoverBySID(db, sid))) {
		throw new NotFoundError('comic cover does not exist');
	}

	return await dbupdateComicCoverBySID(db, sid, v);
}

export async function deleteComicCoverBySID(
	db: DB,
	sid: ComicGenericSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic cover');
	}

	if (!(await dbdeleteComicCoverBySID(db, sid))) {
		throw new NotFoundError('comic cover does not exist');
	}
}

export async function listComicCover(db: DB, params: ParComicCover): Promise<ComicCover[]> {
	return await selectComicCover(db, params);
}

export async function countComicCover(db: DB, params: ParComicCover): Promise<number> {
	return await dbcountComicCover(db, params);
}

export async function addComicSynopsis(
	db: DB,
	v: NewComicSynopsis,
	a?: AccessToken
): Promise<ComicSynopsis> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic synopsis');
	}

	return await insertComicSynopsis(db, v);
}

export async function getComicSynopsisBySID(db: DB, sid: ComicGenericSID): Promise<ComicSynopsis> {
	const r = await selectComicSynopsisBySID(db, sid);

	if (!r) throw new NotFoundError('comic synopsis does not exist');

	return r;
}

export async function updateComicSynopsisBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicSynopsis,
	a?: AccessToken
): Promise<ComicSynopsis | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic synopsis');
	}

	if (!(await dbexistsComicSynopsisBySID(db, sid))) {
		throw new NotFoundError('comic synopsis does not exist');
	}

	return await dbupdateComicSynopsisBySID(db, sid, v);
}

export async function deleteComicSynopsisBySID(
	db: DB,
	sid: ComicGenericSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic synopsis');
	}

	if (!(await dbdeleteComicSynopsisBySID(db, sid))) {
		throw new NotFoundError('comic synopsis does not exist');
	}
}

export async function listComicSynopsis(
	db: DB,
	params: ParComicSynopsis
): Promise<ComicSynopsis[]> {
	return await selectComicSynopsis(db, params);
}

export async function countComicSynopsis(db: DB, params: ParComicSynopsis): Promise<number> {
	return await dbcountComicSynopsis(db, params);
}

export async function addComicExternal(
	db: DB,
	v: NewComicExternal,
	a?: AccessToken
): Promise<ComicExternal> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic external');
	}

	return await insertComicExternal(db, v);
}

export async function getComicExternalBySID(db: DB, sid: ComicGenericSID): Promise<ComicExternal> {
	const r = await selectComicExternalBySID(db, sid);

	if (!r) throw new NotFoundError('comic external does not exist');

	return r;
}

export async function updateComicExternalBySID(
	db: DB,
	sid: ComicGenericSID,
	v: SetComicExternal,
	a?: AccessToken
): Promise<ComicExternal | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic external');
	}

	if (!(await dbexistsComicExternalBySID(db, sid))) {
		throw new NotFoundError('comic external does not exist');
	}

	return await dbupdateComicExternalBySID(db, sid, v);
}

export async function deleteComicExternalBySID(
	db: DB,
	sid: ComicGenericSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic external');
	}

	if (!(await dbdeleteComicExternalBySID(db, sid))) {
		throw new NotFoundError('comic external does not exist');
	}
}

export async function listComicExternal(
	db: DB,
	params: ParComicExternal
): Promise<ComicExternal[]> {
	return await selectComicExternal(db, params);
}

export async function countComicExternal(db: DB, params: ParComicExternal): Promise<number> {
	return await dbcountComicExternal(db, params);
}

export async function addComicCategory(
	db: DB,
	v: NewComicCategory,
	a?: AccessToken
): Promise<ComicCategory> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic category');
	}

	return await insertComicCategory(db, v);
}

export async function getComicCategoryBySID(db: DB, sid: ComicCategorySID): Promise<ComicCategory> {
	const r = await selectComicCategoryBySID(db, sid);

	if (!r) throw new NotFoundError('comic category does not exist');

	return r;
}

export async function updateComicCategoryBySID(
	db: DB,
	sid: ComicCategorySID,
	v: SetComicCategory,
	a?: AccessToken
): Promise<ComicCategory | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic category');
	}

	if (!(await dbexistsComicCategoryBySID(db, sid))) {
		throw new NotFoundError('comic category does not exist');
	}

	return await dbupdateComicCategoryBySID(db, sid, v);
}

export async function deleteComicCategoryBySID(
	db: DB,
	sid: ComicCategorySID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic category');
	}

	if (!(await dbdeleteComicCategoryBySID(db, sid))) {
		throw new NotFoundError('comic category does not exist');
	}
}

export async function listComicCategory(
	db: DB,
	params: ParComicCategory
): Promise<ComicCategory[]> {
	return await selectComicCategory(db, params);
}

export async function countComicCategory(db: DB, params: ParComicCategory): Promise<number> {
	return await dbcountComicCategory(db, params);
}

export async function addComicTag(db: DB, v: NewComicTag, a?: AccessToken): Promise<ComicTag> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic tag');
	}

	return await insertComicTag(db, v);
}

export async function getComicTagBySID(db: DB, sid: ComicTagSID): Promise<ComicTag> {
	const r = await selectComicTagBySID(db, sid);

	if (!r) throw new NotFoundError('comic tag does not exist');

	return r;
}

export async function updateComicTagBySID(
	db: DB,
	sid: ComicTagSID,
	v: SetComicTag,
	a?: AccessToken
): Promise<ComicTag | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic tag');
	}

	if (!(await dbexistsComicTagBySID(db, sid))) {
		throw new NotFoundError('comic tag does not exist');
	}

	return await dbupdateComicTagBySID(db, sid, v);
}

export async function deleteComicTagBySID(
	db: DB,
	sid: ComicTagSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic tag');
	}

	if (!(await dbdeleteComicTagBySID(db, sid))) {
		throw new NotFoundError('comic tag does not exist');
	}
}

export async function listComicTag(db: DB, params: ParComicTag): Promise<ComicTag[]> {
	return await selectComicTag(db, params);
}

export async function countComicTag(db: DB, params: ParComicTag): Promise<number> {
	return await dbcountComicTag(db, params);
}

export async function addComicRelationType(
	db: DB,
	v: NewComicRelationType,
	a?: AccessToken
): Promise<ComicRelationType> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic relation type');
	}

	return await insertComicRelationType(db, v);
}

export async function getComicRelationTypeByCode(db: DB, code: string): Promise<ComicRelationType> {
	const r = await selectComicRelationTypeByCode(db, code);

	if (!r) throw new NotFoundError('comic relation type does not exist');

	return r;
}

export async function updateComicRelationTypeByCode(
	db: DB,
	code: string,
	v: SetComicRelationType,
	a?: AccessToken
): Promise<ComicRelationType | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic relation type');
	}

	if (!(await dbexistsComicRelationTypeByCode(db, code))) {
		throw new NotFoundError('comic relation type does not exist');
	}

	return await dbupdateComicRelationTypeByCode(db, code, v);
}

export async function deleteComicRelationTypeByCode(
	db: DB,
	code: string,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic relation type');
	}

	if (!(await dbdeleteComicRelationTypeByCode(db, code))) {
		throw new NotFoundError('comic relation type does not exist');
	}
}

export async function listComicRelationType(
	db: DB,
	params: ParComicRelationType
): Promise<ComicRelationType[]> {
	return await selectComicRelationType(db, params);
}

export async function countComicRelationType(
	db: DB,
	params: ParComicRelationType
): Promise<number> {
	return await dbcountComicRelationType(db, params);
}

export async function addComicRelation(
	db: DB,
	v: NewComicRelation,
	a?: AccessToken
): Promise<ComicRelation> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic relation');
	}

	return await insertComicRelation(db, v);
}

export async function getComicRelationBySID(db: DB, sid: ComicRelationSID): Promise<ComicRelation> {
	const r = await selectComicRelationBySID(db, sid);

	if (!r) throw new NotFoundError('comic relation does not exist');

	return r;
}

export async function updateComicRelationBySID(
	db: DB,
	sid: ComicRelationSID,
	v: SetComicRelation,
	a?: AccessToken
): Promise<ComicRelation | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic relation');
	}

	if (!(await dbexistsComicRelationBySID(db, sid))) {
		throw new NotFoundError('comic relation does not exist');
	}

	return await dbupdateComicRelationBySID(db, sid, v);
}

export async function deleteComicRelationBySID(
	db: DB,
	sid: ComicRelationSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic relation');
	}

	if (!(await dbdeleteComicRelationBySID(db, sid))) {
		throw new NotFoundError('comic relation does not exist');
	}
}

export async function listComicRelation(
	db: DB,
	params: ParComicRelation
): Promise<ComicRelation[]> {
	return await selectComicRelation(db, params);
}

export async function countComicRelation(db: DB, params: ParComicRelation): Promise<number> {
	return await dbcountComicRelation(db, params);
}

export async function addComicChapter(
	db: DB,
	v: NewComicChapter,
	a?: AccessToken
): Promise<ComicChapter> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to add comic chapter');
	}

	return await insertComicChapter(db, v);
}

export async function getComicChapterBySID(db: DB, sid: ComicChapterSID): Promise<ComicChapter> {
	const r = await selectComicChapterBySID(db, sid);

	if (!r) throw new NotFoundError('comic chapter does not exist');

	return r;
}

export async function updateComicChapterBySID(
	db: DB,
	sid: ComicChapterSID,
	v: SetComicChapter,
	a?: AccessToken
): Promise<ComicChapter | undefined> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to update comic chapter');
	}

	if (!(await dbexistsComicChapterBySID(db, sid))) {
		throw new NotFoundError('comic chapter does not exist');
	}

	return await dbupdateComicChapterBySID(db, sid, v);
}

export async function deleteComicChapterBySID(
	db: DB,
	sid: ComicChapterSID,
	a?: AccessToken
): Promise<void> {
	if (!a?.hasPermission(tokenPermissionKey('write'))) {
		throw new PermissionError('missing admin permission to delete comic chapter');
	}

	if (!(await dbdeleteComicChapterBySID(db, sid))) {
		throw new NotFoundError('comic chapter does not exist');
	}
}

export async function listComicChapter(db: DB, params: ParComicChapter): Promise<ComicChapter[]> {
	return await selectComicChapter(db, params);
}

export async function countComicChapter(db: DB, params: ParComicChapter): Promise<number> {
	return await dbcountComicChapter(db, params);
}
