import type { LayoutLoad } from './$types';
import type { BCWebsite, DEComic } from '$lib/api';
import { getComicData, getWebsiteThumbnail } from '$lib/helper';

export const load: LayoutLoad = async ({ fetch }) => {
	const comicData = function (code: string): Promise<DEComic> {
		return getComicData(fetch, code);
	};

	const websiteThumbnail = function (website: BCWebsite): Promise<string> {
		return getWebsiteThumbnail(fetch, website);
	};

	return { comicData, websiteThumbnail };
};
