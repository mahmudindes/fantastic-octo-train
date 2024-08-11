import { APIError, deClient } from './api';
import type { DEComic, DEWebsite, OrderBy } from './api';
import comicCover from '$assets/comicCover.jpg';

type fetch = typeof fetch;

export async function getComics(
	fetch: fetch,
	page?: number,
	limit?: number,
	orderBys?: OrderBy[],
	others?: Record<string, string | null>
): Promise<DEComic[]> {
	const deComicsRes = await deClient.GET('/comics', {
		fetch,
		params: {
			query: {
				page,
				limit,
				order_by: orderBys?.map((val) => {
					let orderBy = val.name;
					if (val.sort) {
						orderBy += ' sort=' + val.sort;
					}
					if (val.null) {
						orderBy += ' null=' + val.null;
					}
					return orderBy;
				})
			}
		}
	});

	const deComicsErr = deComicsRes.error;
	if (deComicsErr) {
		throw new APIError(deComicsErr.error.message, Number(deComicsErr.error.status));
	}

	if (others) {
		others['Total-Count'] = deComicsRes.response.headers.get('X-Total-Count');
	}

	return deComicsRes.data ?? [];
}

export async function getComic(fetch: fetch, code: string): Promise<DEComic> {
	const deComicRes = await deClient.GET('/comics/{code}', {
		params: { path: { code } },
		fetch
	});

	const bcComicErr = deComicRes.error;
	if (bcComicErr) {
		throw new APIError(bcComicErr.error.message, Number(bcComicErr.error.status));
	}

	return deComicRes.data;
}

export function getComicTitle(comic: DEComic, i18n: string = 'en'): string {
	const deTitle = comic.titles?.sort((a, b) => {
		if (a.languageIETF !== i18n && b.languageIETF === i18n) return 1;
		if (a.languageIETF === i18n && b.languageIETF !== i18n) return -1;

		if (a.synonym && !b.synonym) return 1;
		if (!a.synonym && b.synonym) return -1;

		switch (i18n) {
			case 'ja':
			case 'ko':
			case 'zh':
				break;
			default:
				if (!a.romanized && b.romanized) return 1;
				if (a.romanized && !b.romanized) return -1;
				break;
		}

		if (a.createdAt < b.createdAt) return 1;
		if (a.createdAt > b.createdAt) return -1;

		return 0;
	})[0];

	return deTitle?.title ?? 'Unknown';
}

export function getComicCover(comic: DEComic): string {
	const deCover = comic.covers?.sort((a, b) => {
		if (!a.priority && b.priority) return 1;
		if (a.priority && !b.priority) return -1;
		if (a.priority && b.priority) {
			if (a.priority < b.priority) return 1;
			if (a.priority > b.priority) return -1;
		}

		if (a.createdAt < b.createdAt) return 1;
		if (a.createdAt > b.createdAt) return -1;

		return 0;
	})[0];

	if (deCover) {
		let websiteDomain = deCover.websiteDomain;
		switch (websiteDomain) {
			case 'myanimelist.net':
				websiteDomain = 'cdn.myanimelist.net';
				break;
			default:
				break;
		}
		return '//' + websiteDomain + deCover.relativeURL;
	}
	return comicCover;
}

export function getComicSynopsis(comic: DEComic, i18n: string = 'en'): string {
	const deSynopsis = comic.synopses?.sort((a, b) => {
		if (a.languageIETF !== i18n && b.languageIETF === i18n) return 1;
		if (a.languageIETF === i18n && b.languageIETF !== i18n) return -1;

		if (!a.version && b.version) return 1;
		if (a.version && !b.version) return -1;

		switch (i18n) {
			case 'ja':
			case 'ko':
			case 'zh':
				break;
			default:
				if (!a.romanized && b.romanized) return 1;
				if (a.romanized && !b.romanized) return -1;
				break;
		}

		if (a.createdAt < b.createdAt) return 1;
		if (a.createdAt > b.createdAt) return -1;

		return 0;
	})[0];

	return deSynopsis?.synopsis ?? 'Empty descriptions.';
}

export async function getWebsite(fetch: fetch, domain: string): Promise<DEWebsite> {
	const deWebsiteRes = await deClient.GET('/websites/{domain}', {
		params: { path: { domain } },
		fetch
	});

	const bcWebsiteErr = deWebsiteRes.error;
	if (bcWebsiteErr) {
		throw new APIError(bcWebsiteErr.error.message, Number(bcWebsiteErr.error.status));
	}

	return deWebsiteRes.data;
}
