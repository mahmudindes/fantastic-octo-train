export interface OrderBy {
	name: string;
	sort?: string;
	null?: string;
}

export interface Language {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	ietf: string;
	name: string;
}
export interface NewLanguage {
	ietf: string;
	name: string;
}
export interface SetLanguage {
	ietf?: string;
	name?: string;
}
export interface ParLanguage {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface Website {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	domain: string;
	name: string;
}
export interface NewWebsite {
	domain: string;
	name: string;
}
export interface SetWebsite {
	domain?: string;
	name?: string;
}
export interface ParWebsite {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface CategoryType {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	code: string;
	name: string;
}
export interface NewCategoryType {
	code: string;
	name: string;
}
export interface SetCategoryType {
	code?: string;
	name?: string;
}
export interface ParCategoryType {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface Category {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	typeID: number;
	typeCode: string;
	code: string;
	name: string;
}
export interface NewCategory {
	typeID?: number;
	typeCode?: string;
	code: string;
	name: string;
}
export interface SetCategory {
	typeID?: number;
	typeCode?: string;
	code?: string;
	name?: string;
}
export interface ParCategory {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}
export interface CategorySID {
	typeID?: number;
	typeCode?: string;
	code: string;
}

export interface CategoryRelation {
	createdAt: Date;
	updatedAt: Date | null;
	parentID: number;
	childID: number;
	childCode: string;
}
export interface NewCategoryRelation {
	typeID?: number;
	typeCode?: string;
	parentID?: number;
	parentCode?: string;
	childID?: number;
	childCode?: string;
}
export interface SetCategoryRelation {
	typeID?: number;
	typeCode?: string;
	parentID?: number;
	parentCode?: string;
	childID?: number;
	childCode?: string;
}
export interface ParCategoryRelation {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}
export interface CategoryRelationSID {
	typeID?: number;
	typeCode?: string;
	parentID?: number;
	parentCode?: string;
	childID?: number;
	childCode?: string;
}

export interface TagType {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	code: string;
	name: string;
}
export interface NewTagType {
	code: string;
	name: string;
}
export interface SetTagType {
	code?: string;
	name?: string;
}
export interface ParTagType {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface Tag {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	typeID: number;
	typeCode: string;
	code: string;
	name: string;
}
export interface NewTag {
	typeID?: number;
	typeCode?: string;
	code: string;
	name: string;
}
export interface SetTag {
	typeID?: number;
	typeCode?: string;
	code?: string;
	name?: string;
}
export interface ParTag {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}
export interface TagSID {
	typeID?: number;
	typeCode?: string;
	code: string;
}

export interface Comic {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	code: string;
	titles?: ComicTitle[];
	covers?: ComicCover[];
	synopses?: ComicSynopsis[];
	languageID: number | null;
	languageIETF: string | null;
	publishedFrom: Date | null;
	publishedTo: Date | null;
	totalChapter: number | null;
	totalVolume: number | null;
	nsfw: number | null;
	nsfl: number | null;
	chapters?: ComicChapter[];
	externals?: ComicExternal[];
	categories?: ComicCategory[];
	tags?: ComicTag[];
	relations?: ComicRelation[];
	additionals: JSON | null;
}
export interface NewComic {
	code: string;
	languageID?: number;
	languageIETF?: string;
	publishedFrom?: Date;
	publishedTo?: Date;
	totalChapter?: number;
	totalVolume?: number;
	nsfw?: number;
	nsfl?: number;
	additionals?: JSON;
}
export interface SetComic {
	code?: string;
	languageID?: number | null;
	languageIETF?: string | null;
	publishedFrom?: Date | null;
	publishedTo?: Date | null;
	totalChapter?: number | null;
	totalVolume?: number | null;
	nsfw?: number | null;
	nsfl?: number | null;
	additionals?: JSON | null;
}
export interface ParComic {
	comicExternals?: Map<string, unknown>;
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface ComicGenericSID {
	comicID?: number;
	comicCode?: string;
	rid: string;
}

export interface ComicTitle {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	comicID: number;
	rid: string;
	languageID: number;
	languageIETF: string;
	title: string;
	synonym: boolean | null;
	romanized: boolean | null;
}
export interface NewComicTitle {
	comicID?: number;
	comicCode?: string;
	rid: string;
	languageID?: number;
	languageIETF?: string;
	title: string;
	synonym?: boolean;
	romanized?: boolean;
}
export interface SetComicTitle {
	comicID?: number;
	comicCode?: string;
	rid?: string;
	languageID?: number;
	languageIETF?: string;
	title?: string;
	synonym?: boolean | null;
	romanized?: boolean | null;
}
export interface ParComicTitle {
	comicIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface ComicCover {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	comicID: number;
	rid: string;
	websiteID: number;
	websiteDomain: string;
	relativeURL: string;
	priority: number | null;
}
export interface NewComicCover {
	comicID?: number;
	comicCode?: string;
	rid: string;
	websiteID?: number;
	websiteDomain?: string;
	relativeURL: string;
	priority?: number;
}
export interface SetComicCover {
	comicID?: number;
	comicCode?: string;
	rid?: string;
	websiteID?: number;
	websiteDomain?: string;
	relativeURL?: string;
	priority?: number | null;
}
export interface ParComicCover {
	comicIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface ComicSynopsis {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	comicID: number;
	rid: string;
	languageID: number;
	languageIETF: string;
	synopsis: string;
	version: string | null;
	romanized: boolean | null;
}
export interface NewComicSynopsis {
	comicID?: number;
	comicCode?: string;
	rid: string;
	languageID?: number;
	languageIETF?: string;
	synopsis: string;
	version?: string;
	romanized?: boolean;
}
export interface SetComicSynopsis {
	comicID?: number;
	comicCode?: string;
	rid?: string;
	languageID?: number;
	languageIETF?: string;
	synopsis?: string;
	version?: string | null;
	romanized?: boolean | null;
}
export interface ParComicSynopsis {
	comicIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface ComicExternal {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	comicID: number;
	rid: string;
	websiteID: number;
	websiteDomain: string;
	relativeURL: string | null;
	official: boolean | null;
}
export interface NewComicExternal {
	comicID?: number;
	comicCode?: string;
	rid: string;
	websiteID?: number;
	websiteDomain?: string;
	relativeURL?: string;
	official?: boolean;
}
export interface SetComicExternal {
	comicID?: number;
	comicCode?: string;
	rid?: string;
	websiteID?: number;
	websiteDomain?: string;
	relativeURL?: string | null;
	official?: boolean | null;
}
export interface ParComicExternal {
	comicIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface ComicCategory {
	createdAt: Date;
	updatedAt: Date | null;
	comicID: number;
	categoryID: number;
	categoryTypeID: number;
	categoryCode: string;
}
export interface NewComicCategory {
	comicID?: number;
	comicCode?: string;
	categoryID?: number;
	categoryTypeID?: number;
	categoryTypeCode?: string;
	categoryCode?: string;
}
export interface SetComicCategory {
	comicID?: number;
	comicCode?: string;
	categoryID?: number;
	categoryTypeID?: number;
	categoryTypeCode?: string;
	categoryCode?: string;
}
export interface ParComicCategory {
	comicIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}
export interface ComicCategorySID {
	comicID?: number;
	comicCode?: string;
	categoryID?: number;
	categorySID?: CategorySID;
}

export interface ComicTag {
	createdAt: Date;
	updatedAt: Date | null;
	comicID: number;
	tagID: number;
	tagTypeID: number;
	tagCode: string;
}
export interface NewComicTag {
	comicID?: number;
	comicCode?: string;
	tagID?: number;
	tagTypeID?: number;
	tagTypeCode?: string;
	tagCode?: string;
}
export interface SetComicTag {
	comicID?: number;
	comicCode?: string;
	tagID?: number;
	tagTypeID?: number;
	tagTypeCode?: string;
	tagCode?: string;
}
export interface ParComicTag {
	comicIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}
export interface ComicTagSID {
	comicID?: number;
	comicCode?: string;
	tagID?: number;
	tagSID?: TagSID;
}

export interface ComicRelationType {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	code: string;
	name: string;
}
export interface NewComicRelationType {
	code: string;
	name: string;
}
export interface SetComicRelationType {
	code?: string;
	name?: string;
}
export interface ParComicRelationType {
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}

export interface ComicRelation {
	createdAt: Date;
	updatedAt: Date | null;
	parentID: number;
	typeID: number;
	childID: number;
	childCode: string;
}
export interface NewComicRelation {
	parentID?: number;
	parentCode?: string;
	typeID?: number;
	typeCode?: string;
	childID?: number;
	childCode?: string;
}
export interface SetComicRelation {
	parentID?: number;
	parentCode?: string;
	typeID?: number;
	typeCode?: string;
	childID?: number;
	childCode?: string;
}
export interface ParComicRelation {
	parentIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}
export interface ComicRelationSID {
	parentID?: number;
	parentCode?: string;
	typeID?: number;
	typeCode?: string;
	childID?: number;
	childCode?: string;
}

export interface ComicChapter {
	id: number;
	createdAt: Date;
	updatedAt: Date | null;
	comicID: number;
	chapter: string;
	version: string | null;
	volume: string | null;
	releasedAt: Date | null;
}
export interface NewComicChapter {
	comicID?: number;
	comicCode?: string;
	chapter: string;
	version?: string;
	volume?: string;
	releasedAt?: Date;
}
export interface SetComicChapter {
	comicID?: number;
	comicCode?: string;
	chapter?: string;
	version?: string | null;
	volume?: string | null;
	releasedAt?: Date | null;
}
export interface ParComicChapter {
	comicIDs?: number[];
	orderBys?: OrderBy[];
	page?: number;
	limit?: number;
}
export interface ComicChapterSID {
	comicID?: number;
	comicCode?: string;
	chapter: string;
	version: string | null;
}

export class GenericError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options);
		this.name = GenericError.name;
	}
}

export class NotFoundError extends GenericError {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options);
		this.name = GenericError.name;
	}
}

export class PermissionError extends GenericError {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options);
		this.name = PermissionError.name;
	}
}

export class DatabaseError extends Error {
	code: string;
	hint: string;

	constructor(message?: string, code: string = '', hint: string = '', options?: ErrorOptions) {
		super(message, options);
		this.code = code;
		this.hint = hint;
		this.name = DatabaseError.name;
	}
}
