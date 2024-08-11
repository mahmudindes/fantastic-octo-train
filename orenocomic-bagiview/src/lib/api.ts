import createClient from 'openapi-fetch';
import * as BC from './openapi/bagicore';
import * as DE from './openapi/donoengine';
import { PUBLIC_BASE_BAGICORE, PUBLIC_BASE_DONOENGINE } from '$env/static/public';

export type BCComic = BC.components['schemas']['Comic'];
export type BCComicChapter = BC.components['schemas']['ComicChapter'];
export type BCWebsite = BC.components['schemas']['Website'];
export type BCLink = BC.components['schemas']['Link'];
export const bcClient = createClient<BC.paths>({ baseUrl: PUBLIC_BASE_BAGICORE });

export type DEComic = DE.components['schemas']['Comic'];
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
