import createClient from 'openapi-fetch';
import * as DE from './openapi/donoengine';
import { PUBLIC_BASE_DONOENGINE } from '$env/static/public';

export type DEComic = DE.components['schemas']['Comic'];
export type DEComicChapter = DE.components['schemas']['ComicChapter'];
export type DEWebsite = DE.components['schemas']['Website'];
export const deClient = createClient<DE.paths>({ baseUrl: PUBLIC_BASE_DONOENGINE });

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
