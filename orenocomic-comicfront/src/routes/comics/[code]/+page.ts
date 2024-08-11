import type { PageLoad } from './$types';
import { APIError, type DEComic, type DEWebsite } from '$lib/api';
import { getComic, getWebsite } from '$lib/helper';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, params }) => {
	const website = function (domain: string): Promise<DEWebsite> {
		return getWebsite(fetch, domain);
	};

	let comic!: DEComic;
	try {
		comic = await getComic(fetch, params.code);
	} catch (e) {
		if (e instanceof APIError) {
			switch (e.statusCode) {
				case 404:
					error(404, 'Not Found');
					break;
				case 500:
					error(500, 'Internal Error');
					break;
			}
		}
		throw e;
	}

	return { comic, website };
};
