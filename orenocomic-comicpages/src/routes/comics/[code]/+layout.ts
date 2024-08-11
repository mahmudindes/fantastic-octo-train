import type { LayoutLoad } from './$types';
import { getComics } from '$lib/helper';

export const load: LayoutLoad = async ({ fetch }) => {
	return {
		newComics: getComics(fetch, 1, 5, [{ name: 'created_at', sort: 'desc' }])
	};
};
