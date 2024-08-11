import { APIError, bcClient, deClient } from './api';
import type { BCComic, BCWebsite, DEComic, OrderBy } from './api';
import comicCover from '$assets/comicCover.jpg';
import websiteThumbnail from '$assets/websiteThumbnail.jpeg';
import { PUBLIC_BASE_WEBSITESNAPSHOT } from '$env/static/public';

type fetch = typeof fetch;

export async function getComics(
	fetch: fetch,
	page?: number,
	limit?: number,
	orderBys?: OrderBy[],
	others?: Record<string, string | null>
): Promise<BCComic[]> {
	const bcComicsRes = await bcClient.GET('/comics', {
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

	const bcComicsErr = bcComicsRes.error;
	if (bcComicsErr) {
		throw new APIError(bcComicsErr.error.message, Number(bcComicsErr.error.status));
	}

	if (others) {
		others['Total-Count'] = bcComicsRes.response.headers.get('X-Total-Count');
	}

	return bcComicsRes.data ?? [];
}

export async function getComic(fetch: fetch, code: string): Promise<BCComic> {
	const bcComicRes = await bcClient.GET('/comics/{code}', {
		params: { path: { code } },
		fetch
	});

	const bcComicErr = bcComicRes.error;
	if (bcComicErr) {
		throw new APIError(bcComicErr.error.message, Number(bcComicErr.error.status));
	}

	return bcComicRes.data;
}

export async function getComicData(fetch: fetch, code: string): Promise<DEComic> {
	const deComicDataRes = await deClient.GET('/comics/{code}', {
		params: { path: { code } },
		fetch
	});

	const bcComicDataErr = deComicDataRes.error;
	if (bcComicDataErr) {
		throw new APIError(bcComicDataErr.error.message, Number(bcComicDataErr.error.status));
	}

	return deComicDataRes.data;
}

export function getComicTitle(comicData: DEComic, i18n: string = 'en'): string {
	const deTitle = comicData.titles?.sort((a, b) => {
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

export function getComicCover(comicData: DEComic): string {
	const deCover = comicData.covers?.sort((a, b) => {
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

export function getComicSynopsis(comicData: DEComic, i18n: string = 'en'): string {
	const deSynopsis = comicData.synopses?.sort((a, b) => {
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

export async function getWebsites(
	fetch: fetch,
	page?: number,
	limit?: number,
	orderBys?: OrderBy[]
): Promise<BCWebsite[]> {
	const bcWebsitesRes = await bcClient.GET('/websites', {
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

	const bcWebsitesErr = bcWebsitesRes.error;
	if (bcWebsitesErr) {
		throw new APIError(bcWebsitesErr.error.message, Number(bcWebsitesErr.error.status));
	}

	return bcWebsitesRes.data ?? [];
}

export async function getWebsite(fetch: fetch, domain: string): Promise<BCWebsite> {
	const bcWebsiteRes = await bcClient.GET('/websites/{domain}', {
		params: { path: { domain } },
		fetch
	});

	const bcWebsiteErr = bcWebsiteRes.error;
	if (bcWebsiteErr) {
		throw new APIError(bcWebsiteErr.error.message, Number(bcWebsiteErr.error.status));
	}

	return bcWebsiteRes.data;
}

export async function getWebsiteThumbnail(fetch: fetch, website: BCWebsite): Promise<string> {
	if (PUBLIC_BASE_WEBSITESNAPSHOT) {
		const url = PUBLIC_BASE_WEBSITESNAPSHOT + encodeURI('https://' + website.domain);
		await fetch(url, { mode: 'no-cors' });
		return url;
	}
	return websiteThumbnail;
}
