import createClient from 'openapi-fetch';
import * as DE from './openapi/donoengine';

export type DEComic = DE.components['schemas']['Comic'];
export type DEComicChapter = DE.components['schemas']['ComicChapter'];
export type DEWebsite = DE.components['schemas']['Website'];
export const deClient = createClient<DE.paths>({ baseUrl: '/api/v0' });

export type OrderBy = {
	name: string;
	sort?: string;
	null?: string;
};

export class APIError extends Error {
	statusCode: number;

	constructor(message?: string | undefined, statusCode: number = -1) {
		super(message);
		this.statusCode = statusCode;
		this.name = APIError.name;
	}
}
