import type { PageLoad } from './$types';
import type { BCComic } from '$lib/api';
import { getComics } from '$lib/helper';

export const load: PageLoad = async ({ fetch }) => {
	const limitComics = 30;
	const comics = function (page: number): Promise<BCComic[]> {
		return getComics(fetch, page, limitComics, [{ name: 'code', sort: 'asc' }]);
	};

	return { comics, limitComics };
};
